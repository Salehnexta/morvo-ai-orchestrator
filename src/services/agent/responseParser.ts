
import { AgentCommand } from "./types";

export class AgentResponseParser {
  // معالجة الاستجابات المهيكلة من الوكيل
  static parseAgentResponse(response: string): { 
    message: string; 
    commands: AgentCommand[] 
  } {
    const commands: AgentCommand[] = [];
    let cleanMessage = response;

    // البحث عن أوامر الأزرار [BUTTON:text:action]
    const buttonRegex = /\[BUTTON:([^:]+):([^\]]+)\]/g;
    let buttonMatch;
    while ((buttonMatch = buttonRegex.exec(response)) !== null) {
      commands.push({
        type: 'button',
        id: `btn_${Date.now()}_${Math.random()}`,
        data: {
          buttons: [{
            text: buttonMatch[1],
            action: buttonMatch[2],
            variant: 'default'
          }]
        }
      });
      cleanMessage = cleanMessage.replace(buttonMatch[0], '');
    }

    // البحث عن أوامر النماذج [FORM:title:field1,field2,...]
    const formRegex = /\[FORM:([^:]+):([^\]]+)\]/g;
    let formMatch;
    while ((formMatch = formRegex.exec(response)) !== null) {
      const fields = formMatch[2].split(',').map(field => {
        const [name, type = 'text'] = field.split(':');
        return {
          name: name.trim(),
          label: name.trim(),
          type: type.trim() as 'text' | 'email' | 'tel' | 'number',
          required: true,
          placeholder: `أدخل ${name.trim()}`
        };
      });

      commands.push({
        type: 'form',
        id: `form_${Date.now()}_${Math.random()}`,
        data: {
          title: formMatch[1],
          fields
        }
      });
      cleanMessage = cleanMessage.replace(formMatch[0], '');
    }

    // البحث عن أوامر حفظ البيانات [SAVE_DATA:json]
    const saveDataRegex = /\[SAVE_DATA:([^\]]+)\]/g;
    let saveMatch;
    while ((saveMatch = saveDataRegex.exec(response)) !== null) {
      try {
        const data = JSON.parse(saveMatch[1]);
        commands.push({
          type: 'save_data',
          id: `save_${Date.now()}_${Math.random()}`,
          data
        });
        cleanMessage = cleanMessage.replace(saveMatch[0], '');
      } catch (error) {
        console.error('خطأ في تحليل بيانات SAVE_DATA:', error);
      }
    }

    // البحث عن طلبات المعلومات [INFO:message]
    const infoRegex = /\[INFO:([^\]]+)\]/g;
    let infoMatch;
    while ((infoMatch = infoRegex.exec(response)) !== null) {
      commands.push({
        type: 'info_request',
        id: `info_${Date.now()}_${Math.random()}`,
        data: {
          message: infoMatch[1]
        }
      });
      cleanMessage = cleanMessage.replace(infoMatch[0], '');
    }

    return {
      message: cleanMessage.trim(),
      commands
    };
  }
}
