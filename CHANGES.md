# Changes in this update

## 1. Logo (now truly round)
- Launcher icon: replaced the stretched 4:3 JPG with a proper adaptive icon (works with circle,
  squircle, square launchers) + round legacy icons. The WHOLE USC seal (wheat, wreath, ribbon
  motto) is visible - nothing cropped. `res/mipmap-*` and `res/mipmap-anydpi-v26`.
- In-app logo: `assets/img/logo.png` is the Cyberwolf seal cropped exactly to its circle
  (transparent corners, no beige square). Used on login, register (larger, 124px) and the sidebar (54px).
- Hosted PHP pages now show the real logo too (they used a generic book icon).

## 2. No internet connection / offline data
- Every page a student opens online is saved inside the app (`OfflineCache.java`,
  `assets/native/snapshot.js`). With no internet those pages open instantly with an
  "Offline - showing data saved <time>" bar; saving/forms are blocked politely.
- Nothing saved for a page -> friendly "No internet connection" screen (Try again / Open saved data).
- Connection returns -> bar turns into "Back online - Refresh". Pull down to refresh also works.
- Saved copies are wiped when the login page is reached online (sign-out / new sign-in).

## 3. Auto-rotate, smooth
- Follows the phone's auto-rotate switch (`screenOrientation="fullUser"`).
- Handles all configuration changes itself, so rotating never reloads the page.
- Cross-fade rotation animation; removed the forced hardware layer that made rotation flicker.
- Landscape CSS for short screens (topbar, dialogs, chat height).

## Files to re-upload to InfinityFree (hosted site)
backend/login.php, backend/Register.php, backend/core/layout_head.php,
backend/assets/css/style.css, backend/assets/img/logo.png (new folder + file)
