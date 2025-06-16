
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Database, MessageSquare, Settings } from "lucide-react";

interface AgentControlDemoProps {
  theme: 'light' | 'dark';
}

const AgentControlDemo = ({ theme }: AgentControlDemoProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            أوامر الأزرار
          </CardTitle>
          <MessageSquare className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500">
            <code>[BUTTON:النص:الأمر]</code>
          </div>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            يمكن للوكيل إضافة أزرار تفاعلية في المحادثة
          </p>
        </CardContent>
      </Card>

      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            نماذج تفاعلية
          </CardTitle>
          <Settings className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500">
            <code>[FORM:العنوان:الحقول]</code>
          </div>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            إنشاء نماذج لجمع بيانات العميل
          </p>
        </CardContent>
      </Card>

      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            حفظ البيانات
          </CardTitle>
          <Database className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500">
            <code>[SAVE_DATA:JSON]</code>
          </div>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            حفظ مباشر للبيانات في قاعدة البيانات
          </p>
        </CardContent>
      </Card>

      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            طلب معلومات
          </CardTitle>
          <Bot className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500">
            <code>[INFO:الرسالة]</code>
          </div>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            عرض رسائل تنبيه للعميل
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentControlDemo;
