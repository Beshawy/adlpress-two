# إعداد Google OAuth

## الملفات المضافة/المعدلة:

### 1. **lib/api.ts**
- ✅ إضافة `initiateGoogleAuth()` - بدء عملية المصادقة مع Google
- ✅ إضافة `handleGoogleCallback()` - معالجة الاستجابة من Google

### 2. **components/auth/LoginDialog.tsx**
- ✅ إضافة زر "تسجيل الدخول بواسطة Google"
- ✅ إضافة معالجة النقر على الزر
- ✅ إضافة حالة التحميل

### 3. **components/auth/SignupDialog.tsx**
- ✅ إضافة زر "إنشاء حساب بواسطة Google"
- ✅ إضافة معالجة النقر على الزر
- ✅ إضافة حالة التحميل

### 4. **app/(pages)/auth/callback/page.tsx**
- ✅ صفحة معالجة الاستجابة من Google
- ✅ استخراج كود المصادقة من URL
- ✅ إرسال الكود للسيرفر
- ✅ حفظ التوكن وتوجيه المستخدم

### 5. **app/(pages)/auth/redirect/page.tsx**
- ✅ صفحة redirect لمعالجة التوجيه من Google
- ✅ توجيه للصفحة المناسبة بناءً على الاستجابة

### 6. **app/(pages)/auth/layout.tsx**
- ✅ Layout لصفحات المصادقة

## التدفق الكامل:

1. **المستخدم يضغط زر Google** في صفحة تسجيل الدخول أو إنشاء الحساب
2. **توجيه لـ Google OAuth** - `https://adl-express-node.vercel.app/api/vi/auth/google`
3. **المستخدم يختار حساب Google** ويوافق على الصلاحيات
4. **Google يعيد توجيه المستخدم** لصفحة redirect مع كود المصادقة
5. **صفحة redirect** توجيه لصفحة callback
6. **صفحة callback** ترسل الكود للسيرفر
7. **السيرفر يتحقق من الكود** ويجلب بيانات المستخدم
8. **السيرفر يصدر JWT token** ويعيده للعميل
9. **حفظ التوكن** وتوجيه المستخدم للصفحة المطلوبة

## إعدادات السيرفر المطلوبة:

### 1. **Google Cloud Console**
- إنشاء مشروع جديد
- تفعيل Google+ API
- إنشاء OAuth 2.0 credentials
- إضافة redirect URIs:
  - `https://adl-express-node.vercel.app/api/vi/auth/google/callback`
  - `http://localhost:3000/auth/redirect` (للاختبار المحلي)

### 2. **متغيرات البيئة المطلوبة**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://adl-express-node.vercel.app/api/vi/auth/google/callback
JWT_SECRET=your_jwt_secret
```

### 3. **إعدادات السيرفر**
- التأكد من أن endpoint `/api/vi/auth/google` يعمل
- التأكد من أن endpoint `/api/vi/auth/google/callback` يعمل
- إعداد JWT token generation
- إعداد قاعدة البيانات لحفظ بيانات المستخدمين

## ملاحظات مهمة:

1. **مشكلة redirect_uri_mismatch**: 
   - تأكد من إضافة جميع redirect URIs في Google Cloud Console
   - تأكد من تطابق URI في الكود مع المسجل في Google

2. **الأمان**:
   - استخدام HTTPS في الإنتاج
   - التحقق من state parameter لمنع CSRF attacks
   - تشفير JWT tokens

3. **التجربة**:
   - إضافة رسائل تحميل واضحة
   - معالجة الأخطاء بشكل مناسب
   - حفظ الصفحة المطلوبة للعودة إليها

## اختبار النظام:

1. تأكد من أن السيرفر يعمل
2. تأكد من إعدادات Google OAuth
3. جرب تسجيل الدخول بواسطة Google
4. تحقق من حفظ التوكن
5. تحقق من التوجيه للصفحة المطلوبة 