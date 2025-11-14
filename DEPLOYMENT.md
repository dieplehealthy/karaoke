# 📦 HƯỚNG DẪN DEPLOYMENT CHI TIẾT

## ✅ Files Sẵn Sàng Upload

Tất cả các files sau đây đã được chuẩn bị và sẵn sàng để upload lên GitHub Pages:

### 📁 Extension Files (Không upload lên GitHub Pages)
```
chrome-extension/
├── manifest.json          ✅ Cập nhật URL GitHub Pages
├── floating_qr.js         ✅ Cập nhật URL GitHub Pages
└── floating_qr.css        (Giữ nguyên)
```

### 📁 GitHub Pages Files (Upload lên GitHub)
```
karaoke/ (GitHub Pages Repository)
├── index.html             ✅ Tạo mới - Trang chủ
├── add.html               ✅ Cập nhật - Firebase sync
├── admin.html             ✅ Tạo mới - Admin panel
├── qrcode.min.js          ✅ Sẵn có - Thư viện QR
├── floating_qr.css        ✅ Sẵn có - CSS
├── README.md              ✅ Tạo mới - Documentation
├── .gitignore             ✅ Tạo mới
└── DEPLOYMENT.md          ✅ File này
```

---

## 🚀 QPBS 5 BƯỚC DEPLOYMENT

### Bước 1: Tạo/Chuẩn Bị GitHub Repository

```bash
# Nếu chưa có repository
cd c:\Users\Toai Anh\Desktop
git clone https://github.com/dieplehealthy/karaoke.git
cd karaoke

# Nếu đã có, vào thư mục
cd c:\Users\Toai Anh\Desktop\karaoke
```

**Hoặc tạo mới trên GitHub:**
1. Mở https://github.com/new
2. Repository name: `karaoke`
3. Public
4. Nhấp **Create repository**

```bash
git clone https://github.com/dieplehealthy/karaoke.git
cd karaoke
```

### Bước 2: Copy Files Vào Repository

Từ thư mục `c:\Users\Toai Anh\Desktop\extentionthutuphatyoutube`:

Copy những files này vào thư mục `karaoke/`:

```bash
# Windows Command Prompt
copy index.html karaoke\
copy add.html karaoke\
copy admin.html karaoke\
copy qrcode.min.js karaoke\
copy floating_qr.css karaoke\
copy README.md karaoke\
copy .gitignore karaoke\
copy DEPLOYMENT.md karaoke\
```

**Hoặc dùng Git:**
```bash
cd karaoke
git status  # Xem files mới
```

### Bước 3: Commit và Push

```bash
# Vào thư mục repository
cd karaoke

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: Karaoke app setup for GitHub Pages"

# Push
git push origin main
```

**Hoặc nếu branch là `master`:**
```bash
git push origin master
```

### Bước 4: Bật GitHub Pages

1. Mở repository: https://github.com/dieplehealthy/karaoke
2. Nhấp **Settings** (tab phía trên)
3. Nhấp **Pages** (menu trái)
4. **Source:**
   - Branch: `main` (hoặc `master`)
   - Folder: `/ (root)`
5. Nhấp **Save**

⏳ Chờ 1-2 phút...

✅ Sẽ hiển thị: "Your site is live at: https://dieplehealthy.github.io/karaoke"

### Bước 5: Kiểm Tra URLs

Truy cập những URLs này để xác minh:

- **Trang Chủ:** https://dieplehealthy.github.io/karaoke/
- **Thêm Bài Hát:** https://dieplehealthy.github.io/karaoke/add.html?session=default_session
- **Admin Panel:** https://dieplehealthy.github.io/karaoke/admin.html

✅ Nếu tất cả đều load → GitHub Pages đã hoạt động!

---

## 📱 Cập Nhật Extension

### Bước 1: Cập Nhật URL trong Extension

**File: `manifest.json`**
```json
{
  "host_permissions": ["https://dieplehealthy.github.io/karaoke/*"]
}
```

**File: `floating_qr.js`**
```javascript
const BASE_URL = 'https://dieplehealthy.github.io/karaoke';
```

✅ **Đã cập nhật sẵn!**

### Bước 2: Reload Extension

1. Mở `chrome://extensions/`
2. Tìm "YT Queue QR"
3. Nhấp nút **Reload** 🔄

### Bước 3: Test trên YouTube

1. Mở https://www.youtube.com
2. QR code hiện ở góc trên bên phải
3. Quét bằng điện thoại
4. URL phải là: `https://dieplehealthy.github.io/karaoke/add.html?session=default_session`

---

## 🔧 Firebase Configuration

**Credentials đã cấu hình trong:**
- `add.html` (dòng 330-341)
- `admin.html` (dòng 290-301)

### Firebase Project: `thutuphat-c751f`

```javascript
{
    apiKey: "AIzaSyBlj5BXufxS4lp4wdVgDKFAncbsUpqa-G8",
    authDomain: "thutuphat-c751f.firebaseapp.com",
    databaseURL: "https://thutuphat-c751f.firebasedatabase.app",
    projectId: "thutuphat-c751f",
    storageBucket: "thutuphat-c751f.firebasestorage.app",
    messagingSenderId: "418283924180",
    appId: "1:418283924180:web:0814987f795cc10a362941"
}
```

### Cấu Hình Firebase Database Rules

1. Mở https://console.firebase.google.com/
2. Project: `thutuphat-c751f`
3. Realtime Database → Rules
4. Thay bằng:

```json
{
  "rules": {
    "queues": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        "songs": {
          "$songId": {
            ".validate": "newData.hasChildren(['title', 'videoId'])"
          }
        }
      }
    }
  }
}
```

5. Nhấp **Publish**

---

## 📋 Checklist Deployment

```
EXTENSION UPDATES
☐ manifest.json - host_permissions cập nhật
☐ floating_qr.js - BASE_URL cập nhật
☐ Extension reload trên Chrome

GITHUB PAGES
☐ Repository tạo: dieplehealthy/karaoke
☐ Files upload lên GitHub:
  ☐ index.html
  ☐ add.html
  ☐ admin.html
  ☐ qrcode.min.js
  ☐ floating_qr.css
  ☐ README.md
  ☐ .gitignore
☐ GitHub Pages bật (Settings → Pages)
☐ Branch: main/master
☐ Folder: / (root)

VERIFICATION
☐ https://dieplehealthy.github.io/karaoke/ load được
☐ https://dieplehealthy.github.io/karaoke/add.html load được
☐ https://dieplehealthy.github.io/karaoke/admin.html load được
☐ QR code hiển thị đúng trên YouTube
☐ Firebase sync hoạt động
☐ Có thể thêm bài hát
☐ Admin panel hiển thị danh sách

TESTING
☐ Mở YouTube
☐ Quét QR bằng điện thoại
☐ Tìm kiếm bài hát
☐ Thêm bài hát
☐ Kiểm tra admin panel
☐ Danh sách cập nhật real-time
```

---

## 🐛 Troubleshooting

### ❌ GitHub Pages không deploy

**Kiểm tra:**
```bash
# Xem status
git status

# Xem branch hiện tại
git branch

# Xem remote
git remote -v
```

**Giải pháp:**
```bash
# Đảm bảo push đến đúng branch
git push origin main

# Hoặc nếu là master
git push origin master
```

### ❌ Files không hiển thị

1. Kiểm tra URL: https://github.com/dieplehealthy/karaoke
2. Files có ở root folder chưa?
3. GitHub Pages settings đúng chưa? (Settings → Pages)

### ❌ QR Code không load

1. F12 → Console → Tìm lỗi
2. Kiểm tra URL trong QR
3. URL phải là HTTPS (GitHub Pages automatic)

### ❌ Firebase không sync

1. Console (F12) → xem error
2. Firebase credentials đúng chưa?
3. Database rules cho phép write chưa?
4. Internet connection ổn định chưa?

---

## 📝 Git Commands Cơ Bản

```bash
# Clone repository
git clone https://github.com/dieplehealthy/karaoke.git

# Vào thư mục
cd karaoke

# Xem status
git status

# Thêm files
git add .
# Hoặc file cụ thể
git add index.html

# Commit
git commit -m "Description"

# Push
git push origin main

# Pull updates
git pull origin main

# Xem history
git log --oneline

# Kiểm tra branch
git branch
```

---

## 🎯 Endpoints Cuối Cùng

**Sau deployment, những URL này sẽ hoạt động:**

| URL | Mục Đích |
|-----|---------|
| `https://dieplehealthy.github.io/karaoke/` | Trang chủ |
| `https://dieplehealthy.github.io/karaoke/index.html` | Trang chủ (explicit) |
| `https://dieplehealthy.github.io/karaoke/add.html?session=default_session` | Thêm bài hát |
| `https://dieplehealthy.github.io/karaoke/admin.html` | Admin panel |

---

## ✅ Hoàn Tất!

**Bây giờ bạn đã có:**
1. ✅ Chrome Extension - hiển thị QR trên YouTube
2. ✅ GitHub Pages - host ứng dụng web
3. ✅ Firebase - lưu danh sách nhạc
4. ✅ Admin Panel - quản lý queue

**Hệ thống sẵn sàng hoạt động!** 🎉

---

**Cần giúp? Kiểm tra logs (F12 Console) hoặc GitHub Issues.**

🎤 **Chúc bạn karaoke vui vẻ!** 🎵
