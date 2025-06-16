
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";

interface AgentCommandProps {
  command: AgentCommand;
  onResponse: (response: any) => void;
  theme: 'light' | 'dark';
}

interface AgentCommand {
  type: 'button' | 'form' | 'info_request' | 'save_data';
  data: any;
  id: string;
}

interface AgentButtonProps {
  text: string;
  action: string;
  variant?: 'default' | 'outline' | 'secondary';
  onResponse: (response: any) => void;
  theme: 'light' | 'dark';
}

const AgentButton = ({ text, action, variant = 'default', onResponse, theme }: AgentButtonProps) => {
  const handleClick = () => {
    onResponse({
      type: 'button_clicked',
      action,
      text,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={`m-1 ${
        theme === 'dark' 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {text}
    </Button>
  );
};

interface AgentFormProps {
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'number';
    required?: boolean;
    placeholder?: string;
  }>;
  title: string;
  onResponse: (response: any) => void;
  theme: 'light' | 'dark';
}

const AgentForm = ({ fields, title, onResponse, theme }: AgentFormProps) => {
  const form = useForm();

  const onSubmit = (data: any) => {
    onResponse({
      type: 'form_submitted',
      title,
      data,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Card className={`m-2 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <CardHeader>
        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                rules={{ required: field.required }}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        {...formField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              إرسال
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const AgentCommands = ({ command, onResponse, theme }: AgentCommandProps) => {
  switch (command.type) {
    case 'button':
      return (
        <div className="flex flex-wrap">
          {command.data.buttons?.map((button: any, index: number) => (
            <AgentButton
              key={index}
              text={button.text}
              action={button.action}
              variant={button.variant}
              onResponse={onResponse}
              theme={theme}
            />
          ))}
        </div>
      );

    case 'form':
      return (
        <AgentForm
          fields={command.data.fields}
          title={command.data.title}
          onResponse={onResponse}
          theme={theme}
        />
      );

    case 'info_request':
      return (
        <Card className={`m-2 ${
          theme === 'dark' 
            ? 'bg-yellow-900/20 border-yellow-600' 
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <CardContent className="p-4">
            <p className={`${
              theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'
            } font-medium`}>
              {command.data.message}
            </p>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
};

export default AgentCommands;
