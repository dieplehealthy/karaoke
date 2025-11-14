# 🚀 Hướng Dẫn Triển Khai GitHub Pages + Firebase

## ✅ Tóm Tắt Cập Nhật

### Files Đã Cập Nhật:
1. **manifest.json** - Thêm host_permissions cho GitHub Pages
2. **floating_qr.js** - Cập nhật BASE_URL từ `localhost:8000` → `https://dieplehealthy.github.io/karaoke`

### URL GitHub Pages:
```
https://dieplehealthy.github.io/karaoke
```

---

## 📋 Quy Trình Triển Khai (Step-by-Step)

### **Bước 1: Chuẩn Bị Repository GitHub**

```bash
# Clone repository
git clone https://github.com/dieplehealthy/karaoke.git
cd karaoke

# Tạo branch gh-pages nếu chưa có
git checkout -b gh-pages
```

---

### **Bước 2: Upload Files Vào GitHub Pages**

Cần upload những files này vào repository:

```
karaoke/
├── index.html          (Trang chủ - tùy chọn)
├── add.html            (Trang chọn bài hát - QUAN TRỌNG)
├── admin.html          (Panel quản lý - QUAN TRỌNG)
├── qrcode.min.js       (Thư viện QR code)
├── floating_qr.css     (CSS popup)
└── README.md
```

**Hành động:**
1. Copy các file từ thư mục hiện tại
2. Commit lên GitHub
3. Push đến branch `main` hoặc `gh-pages`

```bash
git add .
git commit -m "Upload karaoke app files"
git push origin main
```

---

### **Bước 3: Bật GitHub Pages**

1. Mở: https://github.com/dieplehealthy/karaoke
2. Settings → Pages
3. **Source:** 
   - Branch: `main` (hoặc `gh-pages`)
   - Folder: `/ (root)`
4. Nhấp **Save**
5. Chờ 1-2 phút để GitHub Pages deploy

✅ Sau đó URL sẽ hoạt động: `https://dieplehealthy.github.io/karaoke`

---

### **Bước 4: Cập Nhật Extension Trên Chrome**

1. Mở `chrome://extensions/`
2. Tìm extension "YT Queue QR"
3. Nhấp **Reload** 🔄

> **Lý do:** Extension đã được cập nhật để sử dụng GitHub Pages URL thay vì localhost

---

### **Bước 5: Test Extension**

1. Mở YouTube: https://www.youtube.com
2. QR code sẽ hiện ở **góc trên bên phải**
3. Quét QR bằng điện thoại
4. Sẽ chuyển đến: `https://dieplehealthy.github.io/karaoke/add.html?session=default_session`
5. Chọn bài hát
6. Bài hát được lưu vào Firebase

---

## 🔧 Cấu Hình Firebase

### Database Rules (Bảo Mật)

```json
{
  "rules": {
    "queues": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        "songs": {
          "$songId": {
            ".validate": "newData.hasChildren(['title', 'url'])"
          }
        }
      }
    }
  }
}
```

### Cấu Trúc Database:

```
queues/
└── default_session/
    └── songs/
        ├── song_1/
        │   ├── title: "Tên bài"
        │   ├── url: "YouTube URL"
        │   └── addedAt: timestamp
        └── song_2/
            └── ...
```

---

## 📊 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────┐
│  YouTube (youtube.com)              │
│  ┌─────────────────────────────────┐│
│  │ Extension (floating_qr.js)      ││
│  │ Hiển thị QR code                ││
│  │ QR → GitHub Pages URL           ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
              ↓ Quét QR
┌─────────────────────────────────────┐
│ Điện thoại (Mobile)                 │
│ ┌─────────────────────────────────┐ │
│ │ GitHub Pages (Karaoke App)      │ │
│ │ - add.html (chọn bài)           │ │
│ │ - Firebase (lưu dữ liệu)        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
              ↓ Gửi dữ liệu
┌─────────────────────────────────────┐
│ Firebase Realtime Database          │
│ ├─ Danh sách chờ phát              │
│ ├─ Session management              │
│ └─ Sync real-time                  │
└─────────────────────────────────────┘
              ↓ Đọc dữ liệu
┌─────────────────────────────────────┐
│ Admin Panel (admin.html)            │
│ ├─ Xem danh sách                    │
│ ├─ Quản lý queue                    │
│ └─ Điều khiển phát nhạc             │
└─────────────────────────────────────┘
```

---

## ✨ Các File Quan Trọng

| File | Mục Đích | Trạng Thái |
|------|----------|----------|
| `manifest.json` | Config extension | ✅ Cập nhật |
| `floating_qr.js` | Hiển thị QR trên YouTube | ✅ Cập nhật |
| `add.html` | Trang chọn bài (GitHub Pages) | ⏳ Cần upload |
| `admin.html` | Panel quản lý | ⏳ Cần upload |
| `qrcode.min.js` | Thư viện QR | ⏳ Cần upload |

---

## 🔍 Troubleshooting

### ❌ "QR Code không hiển thị trên YouTube"

**Giải pháp:**
1. Reload extension: `chrome://extensions/` → Reload
2. Làm mới YouTube (F5)
3. Kiểm tra Console: F12 → Console
4. Tìm logs: `[YT Queue QR]`

### ❌ "QR không chứa đúng URL"

**Kiểm tra:**
- Mở DevTools (F12) → Console
- Tìm log: `[YT Queue QR] Target URL:`
- URL phải là: `https://dieplehealthy.github.io/karaoke/add.html?session=default_session`

### ❌ "Quét QR không vào được trang"

**Nguyên nhân:**
1. GitHub Pages chưa bật
2. Files chưa upload
3. add.html chưa tồn tại

**Giải pháp:**
1. Kiểm tra: https://dieplehealthy.github.io/karaoke/ → Phải có index.html hoặc add.html
2. Bật GitHub Pages (Settings → Pages)
3. Chờ 1-2 phút deploy

### ❌ "Firebase không sync"

**Kiểm tra:**
1. Firebase credentials đúng trong add.html?
2. Database rules cho phép write?
3. Console có lỗi Firebase?

---

## 📝 Checklist Trước Deploy

- [ ] Repository tạo xong: https://github.com/dieplehealthy/karaoke
- [ ] Tất cả files uploaded lên repository
- [ ] GitHub Pages bật (Settings → Pages)
- [ ] Extension reload trên Chrome
- [ ] Firebase config đúng trong add.html
- [ ] Test QR code trên YouTube
- [ ] Test quét QR bằng điện thoại
- [ ] Test chọn bài hát
- [ ] Test Firebase sync

---

## 🚀 Lệnh Git Nhanh

```bash
# Clone
git clone https://github.com/dieplehealthy/karaoke.git
cd karaoke

# Thêm files
git add .

# Commit
git commit -m "Add karaoke app"

# Push
git push origin main

# Kiểm tra GitHub Pages
# Vào: https://github.com/dieplehealthy/karaoke/settings/pages
```

---

## 📞 Cần Giúp?

### Logs Quan Trọng

**Trên YouTube Console (F12):**
```javascript
[YT Queue QR] Script loaded
[YT Queue QR] Document ready, calling ensure
[YT Queue QR] Creating QR box
[YT Queue QR] QR code rendered successfully
[YT Queue QR] Target URL: https://dieplehealthy.github.io/karaoke/add.html?session=default_session
```

**Trên Admin Console:**
```javascript
Firebase initialized
Queue data: {...}
Database connected
```

---

## ✅ Hoàn Tất!

**Bây giờ hệ thống sẵn sàng:**
1. ✅ Extension trên YouTube → Hiển thị QR
2. ✅ QR chứa GitHub Pages URL → Trỏ tới add.html
3. ✅ add.html trên GitHub Pages → Firebase sync
4. ✅ Firebase DB → Lưu danh sách chờ phát
5. ✅ Admin panel → Quản lý queue

**Hãy deploy lên GitHub Pages ngay!** 🎉
