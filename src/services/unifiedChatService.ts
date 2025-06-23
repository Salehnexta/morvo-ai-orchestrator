// // 🎯 خدمة الشات الموحدة - تدمج جميع الخدمات في مكان واحد
// import { supabase } from "@/integrations/supabase/client";
// import type { 
//   UnifiedDiagnosticResult, 
//   UnifiedConnectionStatus, 
//   UnifiedChatResponse,
//   UnifiedChatContextData,
//   UnifiedChatMessage
// } from '@/types/unifiedChat';

// export class UnifiedChatService {
//   private static readonly FALLBACK_URLS = [
//     'https://morvo-production.up.railway.app'
//   ];
//   private static currentApiUrl = 'https://morvo-production.up.railway.app';
//   private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
//   private static lastSuccessfulFormat: string | null = localStorage.getItem('morvo_successful_format');
//   private static diagnosticHistory: UnifiedDiagnosticResult[] = [];
//   private static lastHealthCheck: UnifiedConnectionStatus | null = null;

//   // === المصادقة ===
//   private static async getAuthToken(): Promise<string | null> {
//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       return session?.access_token || null;
//     } catch (error) {
//       console.warn('Could not get auth token:', error);
//       return null;
//     }
//   }

//   private static getClientId(): string {
//     let clientId = localStorage.getItem('morvo_client_id');
//     if (!clientId) {
//       clientId = `unified-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//       localStorage.setItem('morvo_client_id', clientId);
//     }
//     return clientId;
//   }

//   // === التشخيص الشامل ===
//   static async runComprehensiveDiagnostics(): Promise<UnifiedDiagnosticResult[]> {
//     console.log('🧪 Starting unified comprehensive diagnostics...');
//     const token = await this.getAuthToken();
//     const results: UnifiedDiagnosticResult[] = [];

//     // اختبار التنسيق البسيط مع Railway URL الوحيد
//     const simpleResult = await this.testRequestFormat('simple', {
//       message: 'Test message',
//       client_id: this.getClientId(),
//       conversation_id: this.conversationId || 'test-conv'
//     }, token, '', this.currentApiUrl);
    
//     results.push(simpleResult);

//     // اختبار مع معاملات أساسية
//     const basicResult = await this.testRequestFormat('basic', {
//       message: 'Test message',
//       client_id: this.getClientId(),
//       conversation_id: this.conversationId || 'test-conv',
//       language: 'ar',
//       stream: false
//     }, token);
//     results.push(basicResult);

//     // اختبار مع func في URL
//     const funcResult = await this.testRequestFormat('func-url', {
//       message: 'Test message',
//       client_id: this.getClientId(),
//       conversation_id: this.conversationId || 'test-conv',
//       language: 'ar',
//       stream: false
//     }, token, '?func=chat');
//     results.push(funcResult);

//     // حفظ التنسيق الناجح
//     const successfulTest = results.find(r => r.success);
//     if (successfulTest) {
//       localStorage.setItem('morvo_successful_format', successfulTest.format);
//       this.lastSuccessfulFormat = successfulTest.format;
//       console.log('✅ Found working format:', successfulTest.format);
//     }

//     this.diagnosticHistory = results;
//     return results;
//   }

//   private static async testRequestFormat(
//     formatName: string, 
//     requestBody: any, 
//     token: string | null,
//     urlSuffix: string = '',
//     customBaseUrl?: string
//   ): Promise<UnifiedDiagnosticResult> {
//     const startTime = Date.now();
//     const baseUrl = customBaseUrl || this.currentApiUrl;
    
//     try {
//       const headers: Record<string, string> = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       };

//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 10000);

//       const response = await fetch(`${baseUrl}/v1/chat/test${urlSuffix}`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(requestBody),
//         signal: controller.signal,
//         mode: 'cors'
//       });

//       clearTimeout(timeoutId);
//       const latency = Date.now() - startTime;
      
//       if (response.ok) {
//         const responseData = await response.json();
//         return {
//           format: formatName,
//           success: true,
//           status: response.status,
//           response: responseData,
//           latency,
//           timestamp: new Date()
//         };
//       } else {
//         const errorText = await response.text();
//         return {
//           format: formatName,
//           success: false,
//           status: response.status,
//           error: `HTTP ${response.status}: ${errorText}`,
//           latency,
//           timestamp: new Date()
//         };
//       }
//     } catch (error) {
//       const latency = Date.now() - startTime;
//       let errorMessage = 'Network error';
      
//       if (error instanceof Error) {
//         if (error.name === 'AbortError') {
//           errorMessage = 'Request timeout';
//         } else if (error.message.includes('CORS')) {
//           errorMessage = 'CORS policy error';
//         } else if (error.message.includes('502')) {
//           errorMessage = 'Server unavailable (502)';
//         } else {
//           errorMessage = error.message;
//         }
//       }
      
//       return {
//         format: formatName,
//         success: false,
//         error: errorMessage,
//         latency,
//         timestamp: new Date()
//       };
//     }
//   }

//   // === إرسال الرسائل المحدث ===
//   static async sendMessage(message: string, context?: UnifiedChatContextData): Promise<UnifiedChatResponse> {
//     console.log('🚀 Starting sendMessage with:', { message: message.substring(0, 50), context });
    
//     const token = await this.getAuthToken();
    
//     if (!token) {
//       console.error('❌ No auth token available');
//       return {
//         success: false,
//         message: '',
//         error: 'Authentication required'
//       };
//     }

//     try {
//       console.log('🔧 Preparing message request...');
      
//       let requestBody: any;
//       let urlSuffix = '';
//       let endpoint = '/v1/chat/message';

//       // استخدام التنسيق الناجح المحفوظ
//       if (this.lastSuccessfulFormat === 'simple') {
//         requestBody = {
//           message: message.trim(),
//           client_id: this.getClientId(),
//           conversation_id: this.conversationId || `unified-conv-${Date.now()}`
//         };
//         endpoint = '/v1/chat/test'; // استخدام test endpoint للتنسيق البسيط
//       } else if (this.lastSuccessfulFormat === 'func-url') {
//         requestBody = {
//           message: message.trim(),
//           client_id: this.getClientId(),
//           conversation_id: this.conversationId || `unified-conv-${Date.now()}`,
//           language: 'ar',
//           stream: false
//         };
//         urlSuffix = '?func=chat';
//         endpoint = '/v1/chat/message';
//       } else if (this.lastSuccessfulFormat === 'basic') {
//         requestBody = {
//           message: message.trim(),
//           client_id: this.getClientId(),
//           conversation_id: this.conversationId || `unified-conv-${Date.now()}`,
//           language: 'ar',
//           stream: false
//         };
//         endpoint = '/v1/chat/test';
//       } else {
//         // الافتراضي - نجرب func-url أولاً
//         requestBody = {
//           message: message.trim(),
//           client_id: this.getClientId(),
//           conversation_id: this.conversationId || `unified-conv-${Date.now()}`,
//           language: 'ar',
//           stream: false
//         };
//         urlSuffix = '?func=chat';
//         endpoint = '/v1/chat/message';
//       }

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000); // زيادة timeout

//       console.log('🔧 Using format:', this.lastSuccessfulFormat, 'with endpoint:', `${endpoint}${urlSuffix}`);
//       console.log('📤 Request body:', requestBody);

//       const response = await fetch(`${this.currentApiUrl}${endpoint}${urlSuffix}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(requestBody),
//         signal: controller.signal,
//         mode: 'cors'
//       });

//       clearTimeout(timeoutId);
//       console.log('📥 Response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ API error:', response.status, errorText);
        
//         // إعادة المحاولة مع التشخيص عند خطأ 422 أو 502
//         if (response.status === 422 || response.status === 502) {
//           console.log('🔍 Error detected, running diagnostics...');
//           const diagnosticResults = await this.runComprehensiveDiagnostics();
//           const workingFormat = diagnosticResults.find(r => r.success);
          
//           if (workingFormat && this.lastSuccessfulFormat !== workingFormat.format) {
//             console.log('🔄 Retrying with new working format:', workingFormat.format);
//             return this.sendMessage(message, context);
//           }
//         }
        
//         return {
//           success: false,
//           message: '',
//           error: `Server error: ${response.status} - ${errorText}`
//         };
//       }

//       const data = await response.json();
//       console.log('✅ Response data received:', data);
      
//       // حفظ معرف المحادثة
//       if (data.conversation_id) {
//         this.conversationId = data.conversation_id;
//         sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
//       }

//       console.log('✅ Message sent successfully');
      
//       return {
//         success: true,
//         message: data.message || data.response || 'تم استلام رسالتك بنجاح',
//         conversation_id: data.conversation_id,
//         processing_time_ms: data.processing_time_ms,
//         tokens_used: data.tokens_used || 0,
//         confidence_score: data.confidence_score
//       };

//     } catch (error) {
//       console.error('❌ Connection error in sendMessage:', error);
      
//       let errorMessage = 'Connection failed';
//       if (error instanceof Error) {
//         if (error.name === 'AbortError') {
//           errorMessage = 'Request timeout - server is not responding';
//         } else if (error.message.includes('CORS')) {
//           errorMessage = 'CORS policy error - server configuration issue';
//         } else {
//           errorMessage = error.message;
//         }
//       }
      
//       return {
//         success: false,
//         message: '',
//         error: errorMessage
//       };
//     }
//   }

//   // === اختبار الاتصال ===
//   static async testConnection(): Promise<boolean> {
//     console.log('🔗 Testing connection...');
    
//     const diagnosticResults = await this.runComprehensiveDiagnostics();
//     const successfulTests = diagnosticResults.filter(r => r.success);
    
//     if (successfulTests.length > 0) {
//       this.lastHealthCheck = {
//         isConnected: true,
//         isHealthy: true,
//         lastChecked: new Date(),
//         status: 'healthy',
//         latency: Math.min(...successfulTests.map(t => t.latency))
//       };
//       return true;
//     } else {
//       this.lastHealthCheck = {
//         isConnected: false,
//         isHealthy: false,
//         lastChecked: new Date(),
//         status: 'failed',
//         error: 'All diagnostic tests failed - server may be down or CORS issue'
//       };
//       return false;
//     }
//   }

//   // === معلومات الحالة ===
//   static getConnectionStatus(): UnifiedConnectionStatus | null {
//     return this.lastHealthCheck;
//   }

//   static getDiagnosticResults(): UnifiedDiagnosticResult[] {
//     return this.diagnosticHistory;
//   }

//   static getConversationId(): string | null {
//     return this.conversationId;
//   }

//   // === إعادة التعيين ===
//   static resetConversation(): void {
//     this.conversationId = null;
//     sessionStorage.removeItem('morvo_conversation_id');
//     console.log('🔄 Unified conversation reset');
//   }

//   static clearDiagnosticCache(): void {
//     localStorage.removeItem('morvo_successful_format');
//     this.lastSuccessfulFormat = null;
//     this.diagnosticHistory = [];
//     console.log('🧹 Unified diagnostic cache cleared');
//   }

//   // === استجابة ذكية محلية ===
//   static generateSmartFallbackResponse(message: string, context?: any): string {
//     const lowerMessage = message.toLowerCase();
    
//     if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل')) {
//       return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

// 🔧 **حالة النظام**: يواجه الخادم مشكلة مؤقتة في الاتصال (CORS/502 Error)

// أعتذر عن التأخير التقني. رغم المشكلة التقنية، أنا جاهز لتحليل موقعك بشكل مفصل! 📊

// **سأحلل لك:**
// • الأداء التقني وسرعة التحميل ⚡
// • تحسين محركات البحث (SEO) 🔍  
// • تجربة المستخدم والتصميم 🎨
// • المحتوى واستراتيجية الكلمات المفتاحية 📝

// **معلومات إضافية مطلوبة:**
// • رابط موقعك الإلكتروني 🌐
// • أهدافك التسويقية الحالية 🎯
// • جمهورك المستهدف 👥

// **ملاحظة**: النظام يعمل على إصلاح مشكلة الاتصال تلقائياً. شاركني رابط موقعك وسأبدأ التحليل فوراً! 🚀`;
//     }
    
//     if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام')) {
//       return `أهلاً وسهلاً ${context?.user_profile?.greeting_preference || 'أستاذ'}! 🌟

// ⚠️ **تنبيه تقني**: الخادم يواجه مشكلة مؤقتة (Error 502/CORS)

// أنا مورفو - مساعدك الذكي الموحد للتسويق الرقمي 🤖

// **خدماتي المتاحة (نمط محلي):**
// • تحليل المواقع والسيو 📊
// • استراتيجيات التسويق الرقمي 🎯  
// • إنشاء محتوى احترافي ✨
// • تحليل المنافسين 🔍
// • حملات إعلانية مدروسة 📱

// **حالة النظام**: يعمل على إصلاح الاتصال تلقائياً 🔧

// كيف يمكنني مساعدتك اليوم؟ 💪`;
//     }

//     return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

// ⚠️ **مشكلة تقنية مؤقتة**: الخادم غير متاح حالياً (CORS/502 Error)

// شكراً لرسالتك. النظام الموحد يعمل في **النمط المحلي** حالياً بسبب مشكلة تقنية مؤقتة! 

// **يمكنني مساعدتك في:**
// • تحليل وتحسين المواقع 🌐
// • استراتيجيات التسويق المتقدمة 📈
// • إنشاء محتوى جذاب ومؤثر ✨  
// • تحليل السوق والمنافسين 🔍

// **ملاحظة**: النظام يعمل على إعادة الاتصال بالخادم تلقائياً 🔄

// وضح لي طلبك أكثر وسأقدم لك حلاً مخصصاً! 💡`;
//   }
// }










// import { supabase } from "@/integrations/supabase/client";
// import type { 
//   UnifiedDiagnosticResult, 
//   UnifiedConnectionStatus, 
//   UnifiedChatResponse,
//   UnifiedChatContextData,
//   UnifiedChatMessage
// } from '@/types/unifiedChat';

// // أنواع البيانات
// interface FallbackServer {
//   url: string;
//   priority: number;
//   lastSuccess: Date | null;
// }

// export class UnifiedChatService {
//   // قائمة الخوادم الاحتياطية مع أولوياتها
//   private static readonly FALLBACK_SERVERS: FallbackServer[] = [
//     { url: 'https://morvo-production.up.railway.app', priority: 1, lastSuccess: null },
//     { url: 'https://morvo-production.up.railway.app', priority: 2, lastSuccess: null },
//     { url: 'https://morvo-production.up.railway.app', priority: 3, lastSuccess: null }
//   ];

//   // حالة الخادم الحالي
//   private static currentServerIndex = 0;
//   private static get currentServer(): FallbackServer {
//     return this.FALLBACK_SERVERS[this.currentServerIndex];
//   }
//   private static get currentApiUrl(): string {
//     return this.currentServer.url;
//   }

//   // حالة المحادثة
//   private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
//   private static lastSuccessfulFormat: string | null = localStorage.getItem('morvo_successful_format');
//   private static diagnosticHistory: UnifiedDiagnosticResult[] = [];
//   private static lastHealthCheck: UnifiedConnectionStatus | null = null;
//   private static retryCount = 0;
//   private static MAX_RETRIES = 3;

//   // === المصادقة ===
//   private static async getAuthToken(): Promise<string | null> {
//     try {
//       const { data: { session }, error } = await supabase.auth.getSession();
//       if (error) throw error;
//       return session?.access_token || null;
//     } catch (error) {
//       console.error('❌ Failed to get auth token:', error);
//       return null;
//     }
//   }

//   private static getClientId(): string {
//     let clientId = localStorage.getItem('morvo_client_id');
//     if (!clientId) {
//       clientId = crypto.randomUUID();
//       localStorage.setItem('morvo_client_id', clientId);
//     }
//     return clientId;
//   }

//   // === إدارة الخوادم ===
//   private static rotateServer(): void {
//     // ترتيب الخوادم حسب الأفضلية (الأقل أولوية أولاً) وآخر نجاح
//     const sortedServers = [...this.FALLBACK_SERVERS].sort((a, b) => {
//       if (a.lastSuccess && !b.lastSuccess) return -1;
//       if (!a.lastSuccess && b.lastSuccess) return 1;
//       return a.priority - b.priority;
//     });

//     const currentIndex = sortedServers.findIndex(s => s.url === this.currentApiUrl);
//     this.currentServerIndex = (currentIndex + 1) % sortedServers.length;
    
//     console.log(`🔄 Rotating to server: ${this.currentApiUrl}`);
//     this.retryCount = 0;
//   }

//   // === التشخيص الشامل ===
//   static async runComprehensiveDiagnostics(): Promise<UnifiedDiagnosticResult[]> {
//     console.log('🛠️ Starting comprehensive diagnostics...');
//     const token = await this.getAuthToken();
//     const results: UnifiedDiagnosticResult[] = [];

//     // تنسيقات الطلب المختلفة لاختبارها
//     const testCases = [
//       {
//         name: 'simple',
//         endpoint: '/v1/chat/test',
//         body: { 
//           message: 'Diagnostic test', 
//           client_id: this.getClientId(),
//           conversation_id: this.conversationId || 'diagnostic-conv'
//         }
//       },
//       {
//         name: 'basic',
//         endpoint: '/v1/chat/message',
//         body: {
//           message: 'Diagnostic test',
//           client_id: this.getClientId(),
//           conversation_id: this.conversationId || 'diagnostic-conv',
//           language: 'ar',
//           stream: false
//         }
//       },
//       {
//         name: 'func-url',
//         endpoint: '/v1/chat/message?func=chat',
//         body: {
//           message: 'Diagnostic test',
//           client_id: this.getClientId(),
//           conversation_id: this.conversationId || 'diagnostic-conv',
//           language: 'ar'
//         }
//       }
//     ];

//     // اختبار كل تنسيق
//     for (const testCase of testCases) {
//       const result = await this.testRequestWithRetry(
//         testCase.name,
//         testCase.body,
//         token,
//         testCase.endpoint
//       );
      
//       results.push(result);
      
//       // إذا نجح اختبار، نوقف المزيد من الاختبارات
//       if (result.success) {
//         this.lastSuccessfulFormat = testCase.name;
//         localStorage.setItem('morvo_successful_format', testCase.name);
//         this.currentServer.lastSuccess = new Date();
//         break;
//       }
//     }

//     // إذا فشلت جميع الاختبارات، ننتقل للخادم التالي
//     if (!results.some(r => r.success)) {
//       if (this.retryCount < this.MAX_RETRIES) {
//         this.retryCount++;
//         console.log(`🔄 Retrying diagnostics (attempt ${this.retryCount})...`);
//         await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
//         return this.runComprehensiveDiagnostics();
//       } else {
//         this.rotateServer();
//         return this.runComprehensiveDiagnostics();
//       }
//     }

//     this.diagnosticHistory = results;
//     return results;
//   }

//   private static async testRequestWithRetry(
//     formatName: string,
//     requestBody: any,
//     token: string | null,
//     endpoint: string,
//     retries = 2
//   ): Promise<UnifiedDiagnosticResult> {
//     for (let i = 0; i <= retries; i++) {
//       const result = await this.testRequest(formatName, requestBody, token, endpoint);
//       if (result.success) return result;
//       if (i < retries) await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
//     }
//     return this.testRequest(formatName, requestBody, token, endpoint);
//   }

//   private static async testRequest(
//     formatName: string,
//     requestBody: any,
//     token: string | null,
//     endpoint: string
//   ): Promise<UnifiedDiagnosticResult> {
//     const startTime = Date.now();
    
//     try {
//       const headers: Record<string, string> = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       };

//       if (token) headers['Authorization'] = `Bearer ${token}`;

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 8000);

//       const response = await fetch(`${this.currentApiUrl}${endpoint}`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(requestBody),
//         signal: controller.signal
//       });

//       clearTimeout(timeoutId);
//       const latency = Date.now() - startTime;

//       if (response.ok) {
//         const data = await response.json();
//         return { 
//           format: formatName, 
//           success: true, 
//           status: response.status, 
//           response: data, 
//           latency, 
//           timestamp: new Date() 
//         };
//       } else {
//         const errorText = await response.text();
//         return { 
//           format: formatName, 
//           success: false, 
//           status: response.status, 
//           error: `HTTP ${response.status}: ${errorText}`, 
//           latency, 
//           timestamp: new Date() 
//         };
//       }
//     } catch (error) {
//       const latency = Date.now() - startTime;
//       let errorMessage = 'Network error';
      
//       if (error instanceof Error) {
//         errorMessage = error.name === 'AbortError' ? 'Request timeout' : 
//                       error.message.includes('CORS') ? 'CORS error' : 
//                       error.message.includes('502') ? 'Server unavailable' : 
//                       error.message;
//       }
      
//       return { 
//         format: formatName, 
//         success: false, 
//         error: errorMessage, 
//         latency, 
//         timestamp: new Date() 
//       };
//     }
//   }

//   // === إرسال الرسائل ===
//   static async sendMessage(
//     message: string, 
//     context?: UnifiedChatContextData
//   ): Promise<UnifiedChatResponse> {
//     // إذا لم يكن هناك تنسيق ناجح، نقوم بالتشخيص أولاً
//     if (!this.lastSuccessfulFormat) {
//       await this.runComprehensiveDiagnostics();
//       if (!this.lastSuccessfulFormat) {
//         return {
//           success: false,
//           message: this.generateSmartFallbackResponse(message, context),
//           error: 'No working connection format found'
//         };
//       }
//     }

//     const token = await this.getAuthToken();
//     if (!token) {
//       return {
//         success: false,
//         message: this.generateSmartFallbackResponse(message, context),
//         error: 'Authentication required'
//       };
//     }

//     try {
//       // تحضير الطلب حسب التنسيق الناجح
//       const { requestBody, endpoint } = this.prepareRequest(message);
      
//       const response = await fetch(`${this.currentApiUrl}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(requestBody)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         if (response.status === 502 || response.status === 422) {
//           // إعادة التشخيص والمحاولة مرة أخرى
//           await this.runComprehensiveDiagnostics();
//           return this.sendMessage(message, context);
//         }
//         throw new Error(`Server error: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
      
//       // حفظ حالة المحادثة
//       if (data.conversation_id) {
//         this.conversationId = data.conversation_id;
//         sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
//       }

//       return {
//         success: true,
//         message: data.message || data.response || 'تم استلام رسالتك بنجاح',
//         conversation_id: data.conversation_id,
//         processing_time_ms: data.processing_time_ms,
//         tokens_used: data.tokens_used || 0,
//         confidence_score: data.confidence_score
//       };
//     } catch (error) {
//       console.error('❌ Error sending message:', error);
      
//       // إعادة التشخيص والمحاولة مرة أخرى
//       await this.runComprehensiveDiagnostics();
      
//       return {
//         success: false,
//         message: this.generateSmartFallbackResponse(message, context),
//         error: error instanceof Error ? error.message : 'Connection failed'
//       };
//     }
//   }

//   private static prepareRequest(message: string): { requestBody: any; endpoint: string } {
//     const baseBody = {
//       message: message.trim(),
//       client_id: this.getClientId(),
//       conversation_id: this.conversationId || `conv-${Date.now()}`
//     };

//     switch (this.lastSuccessfulFormat) {
//       case 'simple':
//         return {
//           requestBody: baseBody,
//           endpoint: '/v1/chat/test'
//         };
//       case 'func-url':
//         return {
//           requestBody: { ...baseBody, language: 'ar' },
//           endpoint: '/v1/chat/message?func=chat'
//         };
//       case 'basic':
//       default:
//         return {
//           requestBody: { ...baseBody, language: 'ar', stream: false },
//           endpoint: '/v1/chat/message'
//         };
//     }
//   }

//   // === اختبار الاتصال ===
//   static async testConnection(): Promise<boolean> {
//     const results = await this.runComprehensiveDiagnostics();
//     const successfulTests = results.filter(r => r.success);
    
//     this.lastHealthCheck = {
//       isConnected: successfulTests.length > 0,
//       isHealthy: successfulTests.length > 0,
//       lastChecked: new Date(),
//       status: successfulTests.length > 0 ? 'healthy' : 'unhealthy',
//       latency: successfulTests.length > 0 ? 
//         Math.min(...successfulTests.map(t => t.latency)) : null,
//       error: successfulTests.length > 0 ? null : 'All connection tests failed',
//       serverUrl: this.currentApiUrl,
//       activeFormat: this.lastSuccessfulFormat
//     };

//     return successfulTests.length > 0;
//   }

//   // === معلومات الحالة ===
//   static getConnectionStatus(): UnifiedConnectionStatus | null {
//     return this.lastHealthCheck;
//   }

//   static getDiagnosticResults(): UnifiedDiagnosticResult[] {
//     return this.diagnosticHistory;
//   }

//   static getConversationId(): string | null {
//     return this.conversationId;
//   }

//   // === إعادة التعيين ===
//   static resetConversation(): void {
//     this.conversationId = null;
//     sessionStorage.removeItem('morvo_conversation_id');
//     console.log('🔄 Conversation reset');
//   }

//   static clearCache(): void {
//     localStorage.removeItem('morvo_successful_format');
//     localStorage.removeItem('morvo_client_id');
//     this.lastSuccessfulFormat = null;
//     this.diagnosticHistory = [];
//     this.retryCount = 0;
//     console.log('🧹 Cache cleared');
//   }

//   // === استجابة ذكية محلية ===
//   static generateSmartFallbackResponse(message: string, context?: any): string {
//     const lowerMessage = message.toLowerCase();
    
//     if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل')) {
//       return this.getSiteAnalysisResponse(context);
//     }
    
//     if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام')) {
//       return this.getGreetingResponse(context);
//     }

//     return this.getDefaultFallbackResponse(context);
//   }

//   private static getSiteAnalysisResponse(context: any): string {
//     return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

// 🔧 **حالة النظام**: يواجه الخادم مشكلة مؤقتة في الاتصال

// رغم المشكلة التقنية، يمكنني مساعدتك في تحليل موقعك:

// **ما يمكنني تحليله:**
// • أداء الموقع وسرعة التحميل ⚡
// • تحسين محركات البحث (SEO) 🔍  
// • تجربة المستخدم والتصميم 🎨

// **معلومات مطلوبة:**
// • رابط موقعك 🌐
// • أهدافك التسويقية 🎯

// سأقدم لك تحليلاً كاملاً فور عودة الاتصال!`;
//   }

//   private static getGreetingResponse(context: any): string {
//     return `أهلاً ${context?.user_profile?.greeting_preference || 'بك'}! 🌟

// ⚠️ **تنبيه**: الخادم يواجه مشكلة مؤقتة

// أنا هنا لمساعدتك في:
// • تحليل المواقع 📊
// • استراتيجيات التسويق 🎯  
// • إنشاء محتوى احترافي ✨

// كيف يمكنني مساعدتك؟`;
//   }

//   private static getDefaultFallbackResponse(context: any): string {
//     return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

// ⚠️ **مشكلة تقنية مؤقتة**: الخادم غير متاح حالياً

// ما زلت أستطيع مساعدتك في:
// • تحليل المواقع 🌐
// • استراتيجيات التسويق 📈
// • إنشاء محتوى مؤثر ✨  

// اضغط إرسال مرة أخرى أو وضح طلبك أكثر!`;
//   }
// }

import { supabase } from "@/integrations/supabase/client";
import type { 
  UnifiedDiagnosticResult, 
  UnifiedConnectionStatus, 
  UnifiedChatResponse,
  UnifiedChatContextData,
  UnifiedChatMessage
} from '@/types/unifiedChat';

interface FallbackServer {
  url: string;
  priority: number;
  lastSuccess: Date | null;
}

export class UnifiedChatService {
  private static readonly FALLBACK_SERVERS: FallbackServer[] = [
    { url: 'https://morvo-production.up.railway.app', priority: 1, lastSuccess: null },
    { url: 'https://morvo-backup1.example.com', priority: 2, lastSuccess: null },
    { url: 'https://morvo-backup2.example.com', priority: 3, lastSuccess: null }
  ];

  private static currentServerIndex = 0;
  private static get currentServer(): FallbackServer {
    return this.FALLBACK_SERVERS[this.currentServerIndex];
  }
  private static get currentApiUrl(): string {
    return this.currentServer.url;
  }

  private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
  private static lastSuccessfulFormat: string | null = localStorage.getItem('morvo_successful_format');
  private static diagnosticHistory: UnifiedDiagnosticResult[] = [];
  private static lastHealthCheck: UnifiedConnectionStatus | null = null;
  private static retryCount = 0;
  private static MAX_RETRIES = 3;

  private static async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session?.access_token || null;
    } catch (error) {
      console.error('❌ Failed to get auth token:', error);
      return null;
    }
  }

  private static getClientId(): string {
    let clientId = localStorage.getItem('morvo_client_id');
    if (!clientId) {
      clientId = crypto.randomUUID();
      localStorage.setItem('morvo_client_id', clientId);
    }
    return clientId;
  }

  private static rotateServer(): void {
    this.currentServerIndex = (this.currentServerIndex + 1) % this.FALLBACK_SERVERS.length;
    console.log(`🔄 Rotating to server: ${this.currentApiUrl}`);
    this.retryCount = 0;
  }

  static async runComprehensiveDiagnostics(): Promise<UnifiedDiagnosticResult[]> {
    console.log('🛠️ Starting enhanced diagnostics...');
    const token = await this.getAuthToken();
    const results: UnifiedDiagnosticResult[] = [];

    const testCases = [
      {
        name: 'simple',
        endpoint: '/v1/chat/test',
        body: { 
          message: 'Diagnostic test', 
          client_id: this.getClientId(),
          conversation_id: this.conversationId || 'diagnostic-conv'
        },
        timeout: 10000
      },
      {
        name: 'basic',
        // endpoint: '/v1/chat/message',
        endpoint: '/v1/chat/test',
        body: {
          message: 'Diagnostic test',
          client_id: this.getClientId(),
          conversation_id: this.conversationId || 'diagnostic-conv',
          language: 'ar',
          stream: false,
          func: 'chat'
        },
        timeout: 15000
      },
      {
        name: 'func-url',
        // endpoint: '/v1/chat/message?func=chat',
        endpoint: '/v1/chat/test',
        // queryParams: { func: 'chat' },
        body: {
          message: 'Diagnostic test',
          // message: 'Help me with SEO for my website',
          client_id: this.getClientId(),
          conversation_id: this.conversationId || 'diagnostic-conv',
          stream: false,
          // language: 'ar'
        },
        timeout: 15000
      }
    ];

    for (const testCase of testCases) {
      const result = await this.testRequestWithRetry(
        testCase.name,
        testCase.body,
        token,
        testCase.endpoint,
        testCase.timeout,
        testCase.queryParams
      );
      
      results.push(result);
      
      if (result.success) {
        this.lastSuccessfulFormat = testCase.name;
        localStorage.setItem('morvo_successful_format', testCase.name);
        this.currentServer.lastSuccess = new Date();
      }
    }

    if (!results.some(r => r.success)) {
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        console.log(`🔄 Retrying diagnostics (attempt ${this.retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * this.retryCount));
        return this.runComprehensiveDiagnostics();
      } else {
        this.rotateServer();
        return this.runComprehensiveDiagnostics();
      }
    }

    this.diagnosticHistory = results;
    return results;
  }

  private static async testRequestWithRetry(
    formatName: string,
    requestBody: any,
    token: string | null,
    endpoint: string,
    timeout: number = 10000,
    queryParams?: Record<string, string>,
    retries: number = 2
  ): Promise<UnifiedDiagnosticResult> {
    for (let i = 0; i <= retries; i++) {
      const result = await this.testRequest(
        formatName,
        requestBody,
        token,
        endpoint,
        timeout,
        queryParams
      );
      
      if (result.success) return result;
      
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    
    return this.testRequest(
      formatName,
      requestBody,
      token,
      endpoint,
      timeout,
      queryParams
    );
  }

  private static async testRequest(
    formatName: string,
    requestBody: any,
    token: string | null,
    endpoint: string,
    timeout: number,
    queryParams?: Record<string, string>
  ): Promise<UnifiedDiagnosticResult> {
    const startTime = Date.now();
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${this.currentApiUrl}${endpoint}`;
      if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();
        url += `?${queryString}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      console.log(`Sending ${formatName} request to: ${url}`);
      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          format: formatName,
          success: true,
          status: response.status,
          response: data,
          latency,
          timestamp: new Date()
        };
      } else {
        const errorText = await response.text();
        return {
          format: formatName,
          success: false,
          status: response.status,
          error: `HTTP ${response.status}: ${errorText}`,
          latency,
          timestamp: new Date()
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      let errorMessage = 'Network error';
      
      if (error instanceof Error) {
        errorMessage = error.name === 'AbortError' ? 'Request timeout' : 
                      error.message.includes('CORS') ? 'CORS error' : 
                      error.message;
      }
      
      return {
        format: formatName,
        success: false,
        error: errorMessage,
        latency,
        timestamp: new Date()
      };
    }
  }

  static async sendMessage(
    message: string, 
    context?: UnifiedChatContextData
  ): Promise<UnifiedChatResponse> {
    if (!this.lastSuccessfulFormat) {
      await this.runComprehensiveDiagnostics();
      if (!this.lastSuccessfulFormat) {
        return {
          success: false,
          message: this.generateSmartFallbackResponse(message, context),
          error: 'No working connection format found'
        };
      }
    }

    const token = await this.getAuthToken();
    if (!token) {
      return {
        success: false,
        message: this.generateSmartFallbackResponse(message, context),
        error: 'Authentication required'
      };
    }

    try {
      const { requestBody, endpoint, queryParams, timeout } = this.prepareRequest(message);
      
      let url = `${this.currentApiUrl}${endpoint}`;
      if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();
        url += `?${queryString}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout || 15000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 422) {
          await this.runComprehensiveDiagnostics();
          return this.sendMessage(message, context);
        }
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.conversation_id) {
        this.conversationId = data.conversation_id;
        sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
      }

      return {
        success: true,
        message: data.message || data.response || 'تم استلام رسالتك بنجاح',
        conversation_id: data.conversation_id,
        processing_time_ms: data.processing_time_ms,
        tokens_used: data.tokens_used || 0,
        confidence_score: data.confidence_score
      };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      await this.runComprehensiveDiagnostics();
      
      return {
        success: false,
        message: this.generateSmartFallbackResponse(message, context),
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  private static prepareRequest(message: string): { 
    requestBody: any; 
    endpoint: string; 
    queryParams?: Record<string, string>;
    timeout?: number;
  } {
    const baseBody = {
      message: message.trim(),
      client_id: this.getClientId(),
      conversation_id: this.conversationId || `conv-${Date.now()}`
    };

    switch (this.lastSuccessfulFormat) {
      case 'simple':
        return {
          requestBody: baseBody,
          endpoint: '/v1/chat/test',
          timeout: 10000
        };
      case 'basic':
        return {
          requestBody: { 
            ...baseBody, 
            language: 'ar',
            stream: false,
            func: 'chat'
          },
          // endpoint: '/v1/chat/message',
          endpoint: '/v1/chat/test',
          timeout: 15000
        };
      case 'func-url':
        return {
          requestBody: { 
            ...baseBody, 
            language: 'ar'
          },
          endpoint: '/v1/chat/test',
          // endpoint: '/v1/chat/message?func=chat',
          // queryParams: { func: 'chat' },
          timeout: 15000
        };
      default:
        return {
          requestBody: baseBody,
          endpoint: '/v1/chat/test',
          timeout: 10000
        };
    }
  }

  static async testConnection(): Promise<boolean> {
    const results = await this.runComprehensiveDiagnostics();
    const successfulTests = results.filter(r => r.success);
    
    this.lastHealthCheck = {
      isConnected: successfulTests.length > 0,
      isHealthy: successfulTests.length > 0,
      lastChecked: new Date(),
      status: successfulTests.length > 0 ? 'healthy' : 'unhealthy',
      latency: successfulTests.length > 0 ? 
        Math.min(...successfulTests.map(t => t.latency)) : null,
      error: successfulTests.length > 0 ? null : 'All connection tests failed',
      serverUrl: this.currentApiUrl,
      activeFormat: this.lastSuccessfulFormat
    };

    return successfulTests.length > 0;
  }

  static getConnectionStatus(): UnifiedConnectionStatus | null {
    return this.lastHealthCheck;
  }

  static getDiagnosticResults(): UnifiedDiagnosticResult[] {
    return this.diagnosticHistory;
  }

  static getConversationId(): string | null {
    return this.conversationId;
  }

  static resetConversation(): void {
    this.conversationId = null;
    sessionStorage.removeItem('morvo_conversation_id');
    console.log('🔄 Conversation reset');
  }

  static clearCache(): void {
    localStorage.removeItem('morvo_successful_format');
    localStorage.removeItem('morvo_client_id');
    this.lastSuccessfulFormat = null;
    this.diagnosticHistory = [];
    this.retryCount = 0;
    console.log('🧹 Cache cleared');
  }

  static generateSmartFallbackResponse(message: string, context?: any): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل')) {
      return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

🔧 **حالة النظام**: يواجه الخادم مشكلة مؤقتة في الاتصال

رغم المشكلة التقنية، يمكنني مساعدتك في تحليل موقعك:

**ما يمكنني تحليله:**
• أداء الموقع وسرعة التحميل ⚡
• تحسين محركات البحث (SEO) 🔍  
• تجربة المستخدم والتصميم 🎨

**معلومات مطلوبة:**
• رابط موقعك 🌐
• أهدافك التسويقية 🎯

سأقدم لك تحليلاً كاملاً فور عودة الاتصال!`;
    }
    
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام')) {
      return `أهلاً ${context?.user_profile?.greeting_preference || 'بك'}! 🌟

⚠️ **تنبيه**: الخادم يواجه مشكلة مؤقتة

أنا هنا لمساعدتك في:
• تحليل المواقع 📊
• استراتيجيات التسويق 🎯  
• إنشاء محتوى احترافي ✨

كيف يمكنني مساعدتك؟`;
    }

    return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

⚠️ **مشكلة تقنية مؤقتة**: الخادم غير متاح حالياً

ما زلت أستطيع مساعدتك في:
• تحليل المواقع 🌐
• استراتيجيات التسويق 📈
• إنشاء محتوى مؤثر ✨  

اضغط إرسال مرة أخرى أو وضح طلبك أكثر!`;
  }
}


// import { supabase } from "@/integrations/supabase/client";
// import type { 
//   UnifiedDiagnosticResult, 
//   UnifiedConnectionStatus, 
//   UnifiedChatResponse,
//   UnifiedChatContextData,
//   UnifiedChatMessage
// } from '@/types/unifiedChat';

// export class UnifiedChatService {
//   private static readonly API_URL = 'https://morvo-production.up.railway.app';
//   private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
//   private static lastSuccessfulFormat: string = 'simple';
//   private static diagnosticHistory: UnifiedDiagnosticResult[] = [];
//   private static lastHealthCheck: UnifiedConnectionStatus | null = null;

//   // === المصادقة ===
//   private static async getAuthToken(): Promise<string | null> {
//     try {
//       const { data: { session }, error } = await supabase.auth.getSession();
//       if (error) throw error;
//       return session?.access_token || null;
//     } catch (error) {
//       console.warn('Failed to get auth token:', error);
//       return null;
//     }
//   }

//   private static getClientId(): string {
//     let clientId = localStorage.getItem('morvo_client_id');
//     if (!clientId) {
//       clientId = `unified-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//       localStorage.setItem('morvo_client_id', clientId);
//     }
//     return clientId;
//   }

//   // === التشخيص ===
//   static async runComprehensiveDiagnostics(): Promise<UnifiedDiagnosticResult[]> {
//     console.log('Starting diagnostics...');
//     const token = await this.getAuthToken();
//     const results: UnifiedDiagnosticResult[] = [];

//     // اختبار التنسيق البسيط أولاً
//     const simpleResult = await this.testRequestFormat('simple', {
//       message: 'Test message',
//       client_id: this.getClientId(),
//       conversation_id: this.conversationId || 'test-conv'
//     }, token);

//     results.push(simpleResult);

//     // إذا نجح simple، لا نحتاج اختبار التنسيقات الأخرى
//     if (simpleResult.success) {
//       this.lastSuccessfulFormat = 'simple';
//       localStorage.setItem('morvo_successful_format', 'simple');
//       this.diagnosticHistory = results;
//       return results;
//     }

//     // إذا فشل simple، نجرب التنسيقات الأخرى
//     const basicResult = await this.testRequestFormat('basic', {
//       message: 'Test message',
//       client_id: this.getClientId(),
//       conversation_id: this.conversationId || 'test-conv',
//       language: 'ar',
//       stream: false
//     }, token);

//     results.push(basicResult);

//     const funcResult = await this.testRequestFormat('func-url', {
//       message: 'Test message',
//       client_id: this.getClientId(),
//       conversation_id: this.conversationId || 'test-conv',
//       language: 'ar',
//       stream: false
//     }, token, '?func=chat');

//     results.push(funcResult);

//     // حفظ التنسيق الناجح
//     const successfulTest = results.find(r => r.success);
//     if (successfulTest) {
//       this.lastSuccessfulFormat = successfulTest.format;
//       localStorage.setItem('morvo_successful_format', successfulTest.format);
//     }

//     this.diagnosticHistory = results;
//     return results;
//   }

//   private static async testRequestFormat(
//     formatName: string, 
//     requestBody: any, 
//     token: string | null,
//     urlSuffix: string = ''
//   ): Promise<UnifiedDiagnosticResult> {
//     const startTime = Date.now();
    
//     try {
//       const headers: Record<string, string> = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       };

//       if (token) headers['Authorization'] = `Bearer ${token}`;

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 8000);

//       const response = await fetch(`${this.API_URL}/v1/chat/test${urlSuffix}`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(requestBody),
//         signal: controller.signal
//       });

//       clearTimeout(timeoutId);
//       const latency = Date.now() - startTime;
      
//       if (response.ok) {
//         const responseData = await response.json();
//         return {
//           format: formatName,
//           success: true,
//           status: response.status,
//           response: responseData,
//           latency,
//           timestamp: new Date()
//         };
//       } else {
//         const errorText = await response.text();
//         return {
//           format: formatName,
//           success: false,
//           status: response.status,
//           error: `HTTP ${response.status}: ${errorText}`,
//           latency,
//           timestamp: new Date()
//         };
//       }
//     } catch (error) {
//       const latency = Date.now() - startTime;
//       let errorMessage = 'Network error';
      
//       if (error instanceof Error) {
//         errorMessage = error.name === 'AbortError' ? 'Request timeout' : 
//                       error.message.includes('CORS') ? 'CORS error' : 
//                       error.message;
//       }
      
//       return {
//         format: formatName,
//         success: false,
//         error: errorMessage,
//         latency,
//         timestamp: new Date()
//       };
//     }
//   }

//   // === إرسال الرسائل ===
//   static async sendMessage(message: string, context?: UnifiedChatContextData): Promise<UnifiedChatResponse> {
//     const token = await this.getAuthToken();
    
//     if (!token) {
//       return {
//         success: false,
//         message: this.generateSmartFallbackResponse(message, context),
//         error: 'Authentication required'
//       };
//     }

//     try {
//       // استخدام تنسيق simple فقط
//       const requestBody = {
//         message: message.trim(),
//         client_id: this.getClientId(),
//         conversation_id: this.conversationId || `unified-conv-${Date.now()}`
//       };

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 15000);

//       const response = await fetch(`${this.API_URL}/v1/chat/test`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(requestBody),
//         signal: controller.signal
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         const errorText = await response.text();
//         return {
//           success: false,
//           message: this.generateSmartFallbackResponse(message, context),
//           error: `Server error: ${response.status} - ${errorText}`
//         };
//       }

//       const data = await response.json();
      
//       if (data.conversation_id) {
//         this.conversationId = data.conversation_id;
//         sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
//       }

//       return {
//         success: true,
//         message: data.message || data.response || 'تم استلام رسالتك بنجاح',
//         conversation_id: data.conversation_id,
//         processing_time_ms: data.processing_time_ms,
//         tokens_used: data.tokens_used || 0,
//         confidence_score: data.confidence_score
//       };

//     } catch (error) {
//       console.error('Connection error:', error);
//       return {
//         success: false,
//         message: this.generateSmartFallbackResponse(message, context),
//         error: error instanceof Error ? error.message : 'Connection failed'
//       };
//     }
//   }

//   // === اختبار الاتصال ===
//   static async testConnection(): Promise<boolean> {
//     const results = await this.runComprehensiveDiagnostics();
//     const isConnected = results.some(r => r.success);
    
//     this.lastHealthCheck = {
//       isConnected,
//       isHealthy: isConnected,
//       lastChecked: new Date(),
//       status: isConnected ? 'healthy' : 'unhealthy',
//       latency: isConnected ? results.find(r => r.success)?.latency : undefined,
//       error: isConnected ? undefined : 'All connection tests failed',
//       serverUrl: this.API_URL,
//       activeFormat: this.lastSuccessfulFormat
//     };

//     return isConnected;
//   }

//   // === معلومات الحالة ===
//   static getConnectionStatus(): UnifiedConnectionStatus | null {
//     return this.lastHealthCheck;
//   }

//   static getDiagnosticResults(): UnifiedDiagnosticResult[] {
//     return this.diagnosticHistory;
//   }

//   static getConversationId(): string | null {
//     return this.conversationId;
//   }

//   // === إعادة التعيين ===
//   static resetConversation(): void {
//     this.conversationId = null;
//     sessionStorage.removeItem('morvo_conversation_id');
//     console.log('Conversation reset');
//   }

//   static clearCache(): void {
//     localStorage.removeItem('morvo_successful_format');
//     this.lastSuccessfulFormat = 'simple';
//     this.diagnosticHistory = [];
//     console.log('Cache cleared');
//   }

//   // === استجابة ذكية محلية ===
//   static generateSmartFallbackResponse(message: string, context?: any): string {
//     const lowerMessage = message.toLowerCase();
    
//     if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل')) {
//       return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

// 🔧 **حالة النظام**: يواجه الخادم مشكلة مؤقتة في الاتصال

// رغم المشكلة التقنية، يمكنني مساعدتك في تحليل موقعك:

// **ما يمكنني تحليله:**
// • أداء الموقع وسرعة التحميل ⚡
// • تحسين محركات البحث (SEO) 🔍  
// • تجربة المستخدم والتصميم 🎨

// **معلومات مطلوبة:**
// • رابط موقعك 🌐
// • أهدافك التسويقية 🎯

// سأقدم لك تحليلاً كاملاً فور عودة الاتصال!`;
//     }
    
//     if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام')) {
//       return `أهلاً ${context?.user_profile?.greeting_preference || 'بك'}! 🌟

// ⚠️ **تنبيه**: الخادم يواجه مشكلة مؤقتة

// أنا هنا لمساعدتك في:
// • تحليل المواقع 📊
// • استراتيجيات التسويق 🎯  
// • إنشاء محتوى احترافي ✨

// كيف يمكنني مساعدتك؟`;
//     }

//     return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

// ⚠️ **مشكلة تقنية مؤقتة**: الخادم غير متاح حالياً

// ما زلت أستطيع مساعدتك في:
// • تحليل المواقع 🌐
// • استراتيجيات التسويق 📈
// • إنشاء محتوى مؤثر ✨  

// اضغط إرسال مرة أخرى أو وضح طلبك أكثر!`;
//   }
// }
