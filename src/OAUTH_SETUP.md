# 🔐 Настройка OAuth для Google и Apple Sign In

## ⚠️ Важно!

**Google и Apple OAuth требуют настройки в Supabase Dashboard.**  
Без настройки вы увидите ошибку: `"Provider is not enabled"`

---

## 🔵 Настройка Google OAuth

### 1️⃣ Откройте Supabase Dashboard

Перейдите в: [https://supabase.com/dashboard/project/kcyupmixebkiewxplziz/auth/providers](https://supabase.com/dashboard/project/kcyupmixebkiewxplziz/auth/providers)

### 2️⃣ Включите Google Provider

1. Найдите **Google** в списке провайдеров
2. Нажмите **Enable**

### 3️⃣ Создайте Google OAuth credentials

Следуйте официальной инструкции Supabase:  
👉 **https://supabase.com/docs/guides/auth/social-login/auth-google**

**Краткая версия:**

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите **Google+ API**
4. Перейдите в **Credentials** → **Create Credentials** → **OAuth client ID**
5. Выберите **Web application**
6. Добавьте **Authorized redirect URIs:**
   ```
   https://kcyupmixebkiewxplziz.supabase.co/auth/v1/callback
   ```
7. Скопируйте **Client ID** и **Client Secret**

### 4️⃣ Добавьте credentials в Supabase

1. Вернитесь в Supabase Dashboard → Auth → Providers → Google
2. Вставьте **Client ID** и **Client Secret**
3. Нажмите **Save**

---

## 🍎 Настройка Apple Sign In

### 1️⃣ Откройте Supabase Dashboard

Перейдите в: [https://supabase.com/dashboard/project/kcyupmixebkiewxplziz/auth/providers](https://supabase.com/dashboard/project/kcyupmixebkiewxplziz/auth/providers)

### 2️⃣ Включите Apple Provider

1. Найдите **Apple** в списке провайдеров
2. Нажмите **Enable**

### 3️⃣ Создайте Apple Service ID

Следуйте официальной инструкции Supabase:  
👉 **https://supabase.com/docs/guides/auth/social-login/auth-apple**

**Краткая версия:**

1. Перейдите в [Apple Developer Console](https://developer.apple.com/account/)
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. Создайте **App ID** (если еще нет)
4. Создайте **Service ID:**
   - Identifier: `com.yourapp.services`
   - Enable **Sign In with Apple**
   - Configure → Add domain: `kcyupmixebkiewxplziz.supabase.co`
   - Return URLs: `https://kcyupmixebkiewxplziz.supabase.co/auth/v1/callback`
5. Создайте **Private Key** для Sign In with Apple
6. Скопируйте **Service ID**, **Team ID**, **Key ID**, и скачайте **Private Key (.p8)**

### 4️⃣ Добавьте credentials в Supabase

1. Вернитесь в Supabase Dashboard → Auth → Providers → Apple
2. Вставьте:
   - **Service ID**
   - **Team ID**
   - **Key ID**
   - **Private Key** (содержимое .p8 файла)
3. Нажмите **Save**

---

## ✅ Проверка настройки

После настройки OAuth:

1. Откройте приложение
2. На Welcome screen нажмите кнопку **"Continue with Google"** или **"Continue with Apple"**
3. Должно открыться окно авторизации
4. После успешной авторизации вы попадете в приложение

---

## 🚨 Частые ошибки

### "Provider is not enabled"
- ✅ Проверьте что провайдер включен в Supabase Dashboard
- ✅ Проверьте что credentials правильно введены

### "Invalid redirect URI"
- ✅ Убедитесь что redirect URI точно совпадает:
  ```
  https://kcyupmixebkiewxplziz.supabase.co/auth/v1/callback
  ```

### "OAuth popup blocked"
- ✅ Разрешите popup'ы для приложения в настройках браузера

---

## 📝 Примечания

- **Обязательность Apple Sign In:** Если планируете публикацию в iOS App Store и используете другие социальные логины, Apple **требует** также предоставить Apple Sign In
- **Тестирование:** Протестируйте OAuth в разных браузерах
- **Production:** Перед публикацией проверьте что redirect URLs настроены для production домена

---

## 🎉 Готово!

После настройки OAuth пользователи смогут:
- ✅ Быстро войти через Google (1 клик)
- ✅ Быстро войти через Apple (1 клик)
- ✅ Не нужно запоминать пароли
- ✅ Безопасная авторизация через крупные платформы

**Важно:** Даже если OAuth не настроен, Email/Password авторизация работает сразу без дополнительной настройки! 🚀
