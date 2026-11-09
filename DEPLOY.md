# Student Planner — Hosted setup (InfinityFree)

Live URL used by the Android app: https://absentia29.infinityfreeapp.com/login.php
(change it in `app/src/main/res/values/strings.xml` -> `app_url`)

## 1. Upload the backend
Upload everything inside `backend/` into `htdocs/` of your InfinityFree account
(so `login.php` is at `htdocs/login.php`). Keep the `uploads/` folder and its `.htaccess`.

## 2. Database
1. Control Panel -> MySQL Databases -> create a database.
2. phpMyAdmin -> select that database -> Import -> `backend/student_planner.sql`.
3. Edit `htdocs/db.php`: DB_HOST (e.g. sqlXXX.infinityfree.com), DB_USER, DB_PASS, DB_NAME.

## 3. First login
admin / admin123  and  juan / juan123  (sample accounts).
CHANGE the admin password right away, or delete the sample rows and register your own
(the first registered account becomes admin).

## 4. Build the APK
Push the project to GitHub (Actions builds the APK via `.github/workflows/build-apk.yml`)
or open it in Android Studio.

## Troubleshooting
- "Database connection failed" -> wrong values in db.php.
- Blank page / stuck on "checking browser" -> open the URL once in Chrome, then retry in the app.
- Uploads fail -> make sure `uploads/` and its subfolders exist and are writable (chmod 755/775).
