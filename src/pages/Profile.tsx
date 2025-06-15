
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";

export default function Profile() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    bio: ""
  });

  const content = {
    ar: {
      title: "الملف الشخصي",
      subtitle: "إدارة معلوماتك الشخصية وإعدادات الحساب",
      personalInfo: "المعلومات الشخصية",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      location: "الموقع",
      bio: "نبذة عني",
      changePhoto: "تغيير الصورة",
      save: "حفظ التغييرات",
      cancel: "إلغاء",
      accountSettings: "إعدادات الحساب",
      changePassword: "تغيير كلمة المرور",
      deleteAccount: "حذف الحساب",
      notifications: "الإشعارات"
    },
    en: {
      title: "Profile",
      subtitle: "Manage your personal information and account settings",
      personalInfo: "Personal Information",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      location: "Location",
      bio: "Bio",
      changePhoto: "Change Photo",
      save: "Save Changes",
      cancel: "Cancel",
      accountSettings: "Account Settings",
      changePassword: "Change Password",
      deleteAccount: "Delete Account",
      notifications: "Notifications"
    }
  };

  const t = content[language];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile update:", formData);
  };

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo Card */}
            <div className="lg:col-span-1">
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-2xl">JD</AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formData.name}
                  </CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {formData.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    {t.changePhoto}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Personal Information Form */}
            <div className="lg:col-span-2">
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                          <User className="w-4 h-4 inline mr-2" />
                          {t.name}
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                          <Mail className="w-4 h-4 inline mr-2" />
                          {t.email}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                          <Phone className="w-4 h-4 inline mr-2" />
                          {t.phone}
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                          <MapPin className="w-4 h-4 inline mr-2" />
                          {t.location}
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t.bio}
                      </Label>
                      <textarea
                        id="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                      />
                    </div>

                    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        {t.save}
                      </Button>
                      <Button type="button" variant="outline">
                        {t.cancel}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
