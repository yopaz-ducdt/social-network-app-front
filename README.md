# 📱 Social App — React Native

Ứng dụng mạng xã hội xây dựng bằng **React Native** + **NativeWind (Tailwind CSS)**.

---

## 🚀 Tech Stack

| Công nghệ | Mô tả |
|---|---|
| React Native | Framework mobile |
| NativeWind | Tailwind CSS cho React Native |
| React Navigation | Điều hướng màn hình |
| react-native-safe-area-context | Xử lý safe area |

---

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── AppHeader.jsx       # Header dùng chung toàn hệ thống
│   ├── BottomTab.jsx       # Bottom tab bar dùng chung
│   └── PostCard.jsx        # Card hiển thị bài đăng
│
├── screens/
│   ├── LoginScreen.jsx         # Màn hình đăng nhập
│   ├── SignupScreen.jsx         # Màn hình đăng ký
│   ├── HomeScreen.jsx           # Trang chủ (feed)
│   ├── NotificationScreen.jsx   # Thông báo
│   └── PostDetailScreen.jsx     # Chi tiết bài đăng
│
└── navigation/
    └── AppNavigator.jsx    # Cấu hình điều hướng
```

## ⚙️ Cài đặt

```bash
# 1. Clone project
git clone <repo-url>
cd social-app-front

# 2. Cài dependencies
npm install

# 3. Chạy app
npm start
```
