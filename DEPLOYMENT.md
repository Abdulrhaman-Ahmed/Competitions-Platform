# دليل نشر المشروع على Render و Vercel

## نشر الخادم الخلفي على Render

1. قم بإنشاء حساب على [Render](https://render.com/)
2. أنشئ repository جديد على GitHub وارفع كود الخادم الخلفي (مجلد BackEnd)
3. في Render، أنشئ "New Web Service"
4. قم بربط Repository الخاص بك
5. في قسم "Build & Deploy"، تأكد من الإعدادات التالية:
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. في قسم "Environment Variables"، أضف المتغيرات التالية:
   - `PORT`: 5000
   - `NODE_ENV`: production
   - `DB_HOST`: عنوان قاعدة البيانات الخاصة بك
   - `DB_USER`: اسم المستخدم لقاعدة البيانات
   - `DB_PASS`: كلمة مرور قاعدة البيانات
   - `DB_NAME`: اسم قاعدة البيانات
   - `JWT_SECRET`: مفتاح سري لتشفير JWT (استخدم قيمة قوية وعشوائية)
   - `FRONTEND_URL`: رابط الواجهة الأمامية على Vercel (مثال: https://your-app.vercel.app)
7. اضغط على "Create Web Service" لبدء النشر
8. بعد اكتمال النشر، ستحصل على رابط الخادم الخلفي (مثال: https://your-backend.onrender.com)

## نشر الواجهة الأمامية على Vercel

1. قم بإنشاء حساب على [Vercel](https://vercel.com/)
2. أنشئ repository جديد على GitHub وارفع كود الواجهة الأمامية (مجلد FrontEnd)
3. في Vercel، أنشئ "New Project"
4. قم بربط Repository الخاص بك
5. في قسم "Environment Variables"، أضف المتغير التالي:
   - `VITE_API_URL`: رابط الخادم الخلفي على Render (مثال: https://your-backend.onrender.com/api)
6. اضغط على "Deploy" لبدء النشر
7. بعد اكتمال النشر، ستحصل على رابط الواجهة الأمامية (مثال: https://your-app.vercel.app)

## تحديث ملف vercel.json

بعد نشر الخادم الخلفي على Render، يجب تحديث ملف `vercel.json` في الواجهة الأمامية:

1. افتح ملف `FrontEnd/vercel.json`
2. استبدل `https://your-backend-app.onrender.com` برابط الخادم الخلفي الفعلي على Render
3. أعد نشر الواجهة الأمامية على Vercel

## تحديث ملف server.js

بعد نشر الواجهة الأمامية على Vercel، يجب تحديث ملف `server.js` في الخادم الخلفي:

1. افتح ملف `BackEnd/server.js`
2. استبدل `https://your-frontend-app.vercel.app` برابط الواجهة الأمامية الفعلي على Vercel
3. أعد نشر الخادم الخلفي على Render

## استكشاف الأخطاء وإصلاحها

### مشكلة CORS

إذا واجهت مشاكل في CORS، تأكد من:
- أن رابط الواجهة الأمامية مضاف في قائمة `allowedOrigins` في ملف `server.js`
- أن المتغير `FRONTEND_URL` في متغيرات البيئة على Render يحتوي على رابط الواجهة الأمامية الصحيح

### مشكلة الاتصال بقاعدة البيانات

إذا واجهت مشاكل في الاتصال بقاعدة البيانات، تأكد من:
- أن قاعدة البيانات متاحة ويمكن الوصول إليها من Render
- أن متغيرات البيئة `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` صحيحة
- أن قاعدة البيانات موجودة وأن المستخدم لديه الصلاحيات اللازمة

### مشكلة الاتصال بين الواجهة الأمامية والخادم الخلفي

إذا واجهت مشاكل في الاتصال بين الواجهة الأمامية والخادم الخلفي، تأكد من:
- أن المتغير `VITE_API_URL` في متغيرات البيئة على Vercel يحتوي على رابط الخادم الخلفي الصحيح
- أن الخادم الخلفي يعمل ويمكن الوصول إليه
- أن إعدادات CORS في الخادم الخلفي صحيحة
