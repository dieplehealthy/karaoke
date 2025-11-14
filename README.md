# 🎵 YouTube Karaoke Queue Manager

Một ứng dụng quản lý danh sách phát nhạc YouTube theo thời gian thực, được tích hợp với Chrome Extension và Firebase.

## ✨ Tính Năng

- 🎤 **Quét QR Code** từ YouTube Extension để thêm bài hát
- 📱 **Mobile-Friendly** - Tối ưu cho điện thoại
- ⚡ **Real-time Sync** - Cập nhật danh sách theo thời gian thực qua Firebase
- 🔐 **Secure** - Sử dụng Firebase Realtime Database
- 📊 **Admin Panel** - Quản lý danh sách từ máy tính
- 🎵 **Search Songs** - Tìm kiếm bài hát

## 🚀 Cài Đặt Nhanh

### 1️⃣ Yêu Cầu
- Chrome browser
- GitHub Pages repository
- Firebase project (đã cấu hình)

### 2️⃣ Clone Repository
```bash
git clone https://github.com/dieplehealthy/karaoke.git
cd karaoke
```

### 3️⃣ Upload Lên GitHub Pages

Những file cần có:
```
karaoke/
├── index.html           # Trang chủ
├── add.html             # Trang chọn bài hát
├── admin.html           # Panel quản lý
├── qrcode.min.js        # Thư viện QR code
├── floating_qr.css      # CSS cho extension
└── README.md
```

### 4️⃣ Bật GitHub Pages
1. Mở: https://github.com/dieplehealthy/karaoke
2. Settings → Pages
3. Branch: `main` 
4. Folder: `/ (root)`
5. Nhấp **Save**

URL sẽ là: `https://dieplehealthy.github.io/karaoke`

## 📋 Cách Sử Dụng

### Cho Người Dùng

**Bước 1: Cài Extension**
1. Mở Chrome: `chrome://extensions/`
2. Developer mode: Bật (góc trên bên phải)
3. Load unpacked: Chọn thư mục extension

**Bước 2: Quét QR Code**
1. Mở YouTube: https://www.youtube.com
2. QR code hiện ở góc trên bên phải
3. Quét bằng điện thoại

**Bước 3: Thêm Bài Hát**
1. Tìm kiếm bài hát trên trang
2. Nhấp **Add** để thêm vào danh sách

**Bước 4: Xem Danh Sách**
1. Mở admin panel: https://dieplehealthy.github.io/karaoke/admin.html
2. Xem danh sách phát

### Cho Developers

**Extension Files:**
- `manifest.json` - Config extension
- `floating_qr.js` - Script hiển thị QR trên YouTube
- `floating_qr.css` - Style cho QR box

**GitHub Pages Files:**
- `index.html` - Trang chủ
- `add.html` - Trang thêm bài hát (Firebase sync)
- `admin.html` - Panel quản lý (Firebase sync)

## 🔧 Cấu Hình

### Firebase Config

Cấu hình Firebase trong `add.html` và `admin.html`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebasedatabase.app",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Database Structure

```
queues/
└── default_session/
    └── songs/
        ├── song_id_1/
        │   ├── title: "Tên bài"
        │   ├── videoId: "YouTube ID"
        │   ├── duration: 180
        │   ├── addedAt: timestamp
        │   └── thumbnail: "URL"
        └── song_id_2/
            └── ...
```

### Firebase Rules

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

## 📱 URL Tham Khảo

- **Trang Chủ:** `https://dieplehealthy.github.io/karaoke/`
- **Thêm Bài Hát:** `https://dieplehealthy.github.io/karaoke/add.html?session=default_session`
- **Admin Panel:** `https://dieplehealthy.github.io/karaoke/admin.html`

## 🐛 Troubleshooting

### ❌ QR Code Không Hiển Thị Trên YouTube
- Reload extension: `chrome://extensions/` → Reload
- Làm mới YouTube (F5)
- Kiểm tra Console (F12) để xem lỗi

### ❌ Firebase Không Sync
- Kiểm tra Firebase credentials đúng chưa
- Database rules cho phép read/write chưa
- Console (F12) → Network → Kiểm tra Firebase requests

### ❌ GitHub Pages Không Load
- Kiểm tra: https://dieplehealthy.github.io/karaoke/index.html
- Files upload xong chưa
- GitHub Pages bật chưa (Settings → Pages)

## 🔐 Bảo Mật

- ✅ HTML escaping để chống XSS
- ✅ Firebase Realtime Database với rules
- ✅ Không lưu sensitive data ở local storage
- ✅ HTTPS bắt buộc (GitHub Pages)

## 📊 Kiến Trúc

```
Chrome Extension (YouTube)
        ↓ Hiển thị QR
    QR Code
        ↓ Quét
  GitHub Pages (add.html)
        ↓ Chọn bài
    Firebase DB
        ↓ Sync real-time
  Admin Panel (admin.html)
```

## 🎯 Tính Năng Sắp Tới

- [ ] YouTube API integration cho real search
- [ ] WebSocket cho real-time updates
- [ ] User authentication
- [ ] Playlist management
- [ ] Now Playing display
- [ ] Skip/Vote functionality

## 📝 License

MIT License - Tự do sử dụng và sửa đổi

## 👨‍💻 Author

Phát Thư (dieplehealthy)

## 📞 Hỗ Trợ

Có vấn đề? Hãy:
1. Kiểm tra [GitHub Issues](https://github.com/dieplehealthy/karaoke/issues)
2. Xem [Troubleshooting](#troubleshooting)
3. Mở issue mới nếu cần

---

**Sẵn sàng karaoke! 🎤🎵**
