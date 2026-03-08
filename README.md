# 🎓 English Learning App

Ứng dụng web học tiếng Anh hiện đại với giao diện đẹp mắt, hỗ trợ quản lý từ vựng, bài học, và bài kiểm tra.

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, máy tính của bạn cần cài đặt:

### Bắt Buộc:
- **Docker Desktop** (phiên bản 20.10 trở lên) - https://www.docker.com/products/docker-desktop/

### Tùy Chọn (không bắt buộc):
- **Git** - để clone source code
- **Node.js v20.x** - chỉ cần nếu muốn phát triển mà không dùng Docker

---

## 🚀 Hướng Dẫn Cài Đặt Từ Đầu (Máy Mới)

### Bước 1: Cài Đặt Docker Desktop

#### Windows:
1. Truy cập https://www.docker.com/products/docker-desktop/
2. Tải **Docker Desktop for Windows**
3. Chạy file installer và làm theo hướng dẫn
4. Khởi động lại máy tính nếu được yêu cầu
5. Mở **Docker Desktop** và đợi cho đến khi thấy trạng thái "Docker is running" màu xanh
6. Kiểm tra cài đặt:
```bash
docker --version
docker-compose --version
```

#### macOS:
1. Truy cập https://www.docker.com/products/docker-desktop/
2. Tải **Docker Desktop for Mac** (Intel hoặc Apple Silicon)
3. Mở file .dmg và kéo Docker vào thư mục Applications
4. Mở Docker từ Applications
5. Đợi Docker khởi động hoàn tất
6. Kiểm tra cài đặt:
```bash
docker --version
docker-compose --version
```

#### Linux (Ubuntu/Debian):
```bash
# Cài đặt Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Cài đặt Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Khởi động Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Bước 2: Chuẩn Bị Source Code

#### Tùy Chọn A: Nếu đã có source code
Giải nén source code vào một thư mục, ví dụ: `E:\english_app`

#### Tùy Chọn B: Clone từ Git (nếu có repository)
```bash
git clone <repository-url>
cd english_app
```

### Bước 3: Cấu Hình Environment Variables

#### 3.1. Backend Environment

Tạo file `.env` trong thư mục `back_end/`:

```bash
# Đường dẫn: back_end/.env

NODE_ENV=development
PORT=5000

# Database Configuration (GIỮ NGUYÊN cho Docker)
DATABASE_URL="postgresql://postgres:postgres@db:5432/english_app?schema=public"

# JWT Secret (QUAN TRỌNG: Thay đổi giá trị này)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345678
JWT_EXPIRES_IN=7d

# Email Configuration (Tùy chọn - cho chức năng quên mật khẩu)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=English Learning App <noreply@englishapp.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Lưu ý quan trọng:**
- **GIỮ NGUYÊN** `DATABASE_URL` như trên (cấu hình cho Docker)
- **BẮT BUỘC thay đổi** `JWT_SECRET` thành chuỗi ngẫu nhiên phức tạp
- Email configuration: Chỉ cần nếu muốn dùng chức năng quên mật khẩu

#### 3.2. Frontend Environment

Tạo file `.env` trong thư mục `front_end/`:

```bash
# Đường dẫn: front_end/.env

VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🏃 Chạy Ứng Dụng

### Bước 4: Khởi Động Ứng Dụng (Chỉ 1 Lệnh!)

#### 4.1. Mở Terminal/Command Prompt

**Windows:**
- Nhấn `Win + R`, gõ `cmd` hoặc `powershell`, Enter

**Mac/Linux:**
- Mở Terminal

#### 4.2. Di Chuyển Vào Thư Mục Project

```bash
cd E:\english_app
# Hoặc đường dẫn nơi bạn lưu project
```

#### 4.3. Chạy Lệnh Khởi Động

```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Giải thích lệnh:**
- `-f docker-compose.dev.yml`: Sử dụng file cấu hình development
- `up`: Khởi động các containers
- `-d`: Chạy ở chế độ nền (detached mode)
- Thêm `--build` nếu muốn rebuild images: `docker-compose -f docker-compose.dev.yml up -d --build`

**Lệnh này sẽ tự động:**
- ✅ Build Docker images cho backend và frontend
- ✅ Tải PostgreSQL image
- ✅ Khởi động 3 containers: database, backend, frontend
- ✅ **Tự động chạy database migrations** (nhờ script trong backend)
- ✅ **Lần đầu build mất khoảng 2-3 phút**

#### 4.4. Kiểm Tra Containers Đang Chạy

```bash
docker ps
```

Bạn sẽ thấy 3 containers:
- `english_app_db_dev` - Database PostgreSQL
- `english_app_backend_dev` - Backend API
- `english_app_frontend_dev` - Frontend React

#### 4.5. Xem Logs (Nếu Muốn)

```bash
# Xem logs của tất cả containers
docker-compose -f docker-compose.dev.yml logs -f

# Hoặc xem từng container riêng:
docker logs english_app_frontend_dev -f
docker logs english_app_backend_dev -f
```

**Đợi khoảng 10-30 giây** cho đến khi thấy các dòng log sau:
```
english_app_db_dev        | database system is ready to accept connections
english_app_frontend_dev  |   ➜  Local:   http://localhost:3000/
english_app_backend_dev   | 🚀 Server is running on port 5000
```

### Bước 5: Truy Cập Ứng Dụng 🎉

1. Mở trình duyệt web
2. Truy cập: **http://localhost:3000**
3. Bạn sẽ thấy trang Login của ứng dụng!

**URLs quan trọng:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/api/v1/health

**Lưu ý:** Database migrations đã được tự động chạy khi khởi động backend container, nên bạn có thể đăng ký tài khoản và sử dụng ngay!

---

## 🎯 Sử Dụng Ứng Dụng

### Đăng Ký Tài Khoản Mới

1. Truy cập http://localhost:3000
2. Nhấn vào link **"Create one"** hoặc **"Register"**
3. Điền thông tin:
   - **Tên**: Tên đầy đủ của bạn
   - **Email**: Email hợp lệ
   - **Mật khẩu**: Tối thiểu 6 ký tự
4. Nhấn **"Register"**
5. Đăng nhập với tài khoản vừa tạo

### Đăng Nhập

1. Nhập email và mật khẩu
2. Nhấn **"Login"**
3. Bạn sẽ được chuyển đến Dashboard

### Các Tính Năng Chính

- **Dashboard**: Xem thống kê học tập của bạn
- **Vocabulary**: Quản lý và học từ vựng
- **Lessons**: Các bài học tiếng Anh
- **Quiz**: Làm bài kiểm tra để củng cố kiến thức
- **Profile**: Quản lý thông tin cá nhân, đổi mật khẩu

---

## 🔄 Hot Reload (Tự Động Cập Nhật)

Khi chạy ở chế độ development, ứng dụng hỗ trợ **hot reload**:

### Frontend (React + Vite)
- Mở bất kỳ file nào trong `front_end/src/`
- Chỉnh sửa code
- Nhấn **`Ctrl+S`** (hoặc `Cmd+S` trên Mac)
- → Trình duyệt tự động reload và hiển thị thay đổi ngay lập tức!

### Backend (Node.js + ts-node-dev)
- Mở bất kỳ file nào trong `back_end/src/`
- Chỉnh sửa code
- Nhấn **`Ctrl+S`** (hoặc `Cmd+S` trên Mac)
- → Server tự động restart và áp dụng thay đổi!

---

## ⚙️ Các Lệnh Hữu Ích

### Dừng Ứng Dụng

**Cách 1:** Trong terminal đang chạy Docker, nhấn **`Ctrl+C`**

**Cách 2:** Chạy lệnh:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Khởi Động Lại

```bash
# Khởi động lại các containers
docker-compose -f docker-compose.dev.yml restart

# Hoặc dừng rồi khởi động lại
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d

# Rebuild nếu có thay đổi code dependencies
docker-compose -f docker-compose.dev.yml up -d --build
```

### Xem Logs

**Backend logs:**
```bash
docker logs english_app_backend_dev --follow
```

**Frontend logs:**
```bash
docker logs english_app_frontend_dev --follow
```

**Database logs:**
```bash
docker logs english_app_db_dev --follow
```

**Tất cả logs:**
```bash
docker-compose -f docker-compose.dev.yml logs --follow
```

### Reset Database (Xóa Toàn Bộ Dữ Liệu)

```bash
# 1. Dừng containers
docker-compose -f docker-compose.dev.yml down

# 2. Xóa volume database
docker volume rm english_app_postgres_data_dev

# 3. Khởi động lại (migrations sẽ tự động chạy)
docker-compose -f docker-compose.dev.yml up -d
```

**Lưu ý:** Migrations sẽ tự động chạy khi backend container khởi động, không cần chạy thủ công.

### Xem Database với Prisma Studio

```bash
docker exec -it english_app_backend_dev npx prisma studio
```

Truy cập: http://localhost:5555 để xem và chỉnh sửa database bằng GUI

### Build cho Production

```bash
docker-compose up --build -d
```

---

## 📂 Cấu Trúc Project

```
english_app/
├── back_end/                 # Backend API (Node.js + Express)
│   ├── prisma/              # Database schema & migrations
│   │   ├── schema.prisma    # Database models
│   │   └── migrations/      # Migration files
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Express middlewares
│   │   └── utils/           # Helper functions
│   ├── .env                 # Environment variables
│   ├── Dockerfile           # Production Docker config
│   ├── Dockerfile.dev       # Development Docker config
│   └── package.json
│
├── front_end/               # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   │   ├── layouts/    # Layout components
│   │   │   └── ui/         # UI components
│   │   ├── features/       # Feature modules
│   │   │   └── auth/       # Authentication context
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   ├── .env                # Environment variables
│   ├── Dockerfile           # Production Docker config
│   ├── Dockerfile.dev       # Development Docker config
│   └── package.json
│
├── docker-compose.yml        # Production compose
├── docker-compose.dev.yml    # Development compose (hot reload)
└── README.md                 # Hướng dẫn này
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database
- **PostgreSQL 16** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email service

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling framework
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **React Hot Toast** - Notifications

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---
---

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký tài khoản
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/forgot-password` - Quên mật khẩu
- `POST /api/v1/auth/reset-password` - Đặt lại mật khẩu
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại
- `POST /api/v1/auth/logout` - Đăng xuất

### User
- `GET /api/v1/users/profile` - Lấy thông tin profile
- `PUT /api/v1/users/profile` - Cập nhật profile
- `PUT /api/v1/users/password` - Đổi mật khẩu
- `GET /api/v1/users/stats` - Lấy thống kê học tập

### Health Check
- `GET /api/v1/health` - Kiểm tra API hoạt động

---

## 🐛 Xử Lý Lỗi Thường Gặp

### 1. "Docker is not running"
**Nguyên nhân:** Docker Desktop chưa được khởi động

**Giải pháp:**
- Mở **Docker Desktop**
- Đợi cho đến khi thấy trạng thái "Docker is running" màu xanh
- Thử lại lệnh

### 2. "Port 3000 already in use"
**Nguyên nhân:** Có ứng dụng khác đang sử dụng port 3000

**Giải pháp Windows:**
```bash
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay PID bằng số tìm được)
taskkill /PID <PID> /F
```

**Giải pháp Mac/Linux:**
```bash
# Tìm và kill process
lsof -ti:3000 | xargs kill -9
```

### 3. "Port 5000 already in use"
**Nguyên nhân:** Có ứng dụng khác đang sử dụng port 5000

**Giải pháp:** Tương tự port 3000, thay `3000` bằng `5000`

### 4. "Table 'users' does not exist" / "relation does not exist"
**Nguyên nhân:** Database migrations bị lỗi hoặc chưa chạy thành công

**Giải pháp:**
```bash
# Kiểm tra logs của backend xem migration có lỗi không
docker logs english_app_backend_dev

# Nếu cần chạy lại migration thủ công:
docker exec -it english_app_backend_dev npx prisma migrate deploy

# Hoặc restart backend để tự động chạy lại
docker-compose -f docker-compose.dev.yml restart backend
```

### 5. "Connection refused" / "Cannot connect to database"
**Nguyên nhân:** Database container chưa sẵn sàng hoặc bị lỗi

**Giải pháp:**
```bash
# 1. Kiểm tra containers đang chạy
docker ps

# 2. Kiểm tra logs của database
docker logs english_app_db_dev

# 3. Restart containers
docker-compose -f docker-compose.dev.yml restart

# 4. Nếu vẫn lỗi, reset hoàn toàn
docker-compose -f docker-compose.dev.yml down
docker volume rm english_app_postgres_data_dev
docker-compose -f docker-compose.dev.yml up -d
```

### 6. "ENOSPC: System limit for number of file watchers reached" (Linux)
**Nguyên nhân:** Hệ thống Linux giới hạn số file watchers

**Giải pháp:**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 7. Frontend hiển thị "Network Error" hoặc "Cannot connect to backend"
**Nguyên nhân:** Backend chưa chạy hoặc URL không đúng

**Giải pháp:**
```bash
# 1. Kiểm tra backend đang chạy
docker logs english_app_backend_dev

# 2. Kiểm tra file front_end/.env
# Đảm bảo: VITE_API_URL=http://localhost:5000/api/v1

# 3. Restart frontend
docker-compose -f docker-compose.dev.yml restart frontend
```

### 8. "Internal Server Error" khi đăng ký/đăng nhập
**Nguyên nhân:** Database chưa có bảng (migrations bị lỗi)

**Giải pháp:**
```bash
# Kiểm tra backend logs
docker logs english_app_backend_dev --tail 50

# Chạy migration thủ công nếu cần
docker exec -it english_app_backend_dev npx prisma migrate deploy
```

### 9. Build Docker quá lâu
**Nguyên nhân:** Lần đầu build cần tải nhiều dependencies

**Giải pháp:**
- Kiên nhẫn đợi, lần đầu có thể mất 3-5 phút
- Các lần sau sẽ nhanh hơn nhờ Docker cache
- Đảm bảo kết nối internet ổn định

### 10. Quên mật khẩu admin/test account
**Nguyên nhân:** Không nhớ mật khẩu đã đăng ký

**Giải pháp:**
```bash
# Xem và chỉnh sửa database bằng Prisma Studio
docker exec -it english_app_backend_dev npx prisma studio

# Truy cập: http://localhost:5555
# Chọn bảng "User" và có thể reset mật khẩu
```

---

## 🔐 Bảo Mật

### Development (Hiện tại)
- ✅ CORS enabled cho localhost
- ✅ JWT token với thời hạn 7 ngày
- ✅ Password được hash bằng bcryptjs (12 rounds)
- ✅ Environment variables cho sensitive data
- ✅ Prisma ORM ngăn chặn SQL injection

### Production (Khuyến nghị khi deploy)
- 🔒 **Thay đổi JWT_SECRET** thành chuỗi phức tạp, dài ít nhất 32 ký tự
- 🔒 **Sử dụng HTTPS** cho cả frontend và backend
- 🔒 **Cấu hình CORS** chỉ cho phép domain production cụ thể
- 🔒 **Database password** mạnh và phức tạp
- 🔒 **Rate limiting** để ngăn chặn brute force
- 🔒 **Email service** với App Password hoặc SendGrid/AWS SES
- 🔒 **Không commit file .env** lên repository
- 🔒 **Enable database backup** tự động

---

## 📞 Hỗ Trợ & Gỡ Lỗi

### Bước 1: Kiểm tra cơ bản
```bash
# Docker đang chạy?
docker --version
docker ps

# Containers có đang chạy?
docker-compose -f docker-compose.dev.yml ps
```

### Bước 2: Xem logs
```bash
# Xem logs của container bị lỗi
docker logs english_app_backend_dev --tail 50
docker logs english_app_frontend_dev --tail 50
docker logs english_app_db_dev --tail 50
```

### Bước 3: Thử restart
```bash
# Restart container cụ thể
docker-compose -f docker-compose.dev.yml restart backend

# Hoặc restart toàn bộ
docker-compose -f docker-compose.dev.yml restart
```

### Bước 4: Rebuild nếu cần
```bash
# Rebuild và restart
docker-compose -f docker-compose.dev.yml up --build
```

### Bước 5: Reset hoàn toàn (nếu mọi cách đều thất bại)
```bash
# Dừng và xóa mọi thứ
docker-compose -f docker-compose.dev.yml down -v

# Xóa images
docker rmi english_app-backend english_app-frontend

# Build lại từ đầu (migrations sẽ tự động chạy)
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

---

**Chúc bạn học tiếng Anh vui vẻ và hiệu quả! 🎉📚**

_Developed with ❤️ using React, Node.js, and Docker_
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/english_app?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Email (Quên mật khẩu)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### Biến Môi Trường Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🛠️ Các Lệnh Hữu Ích

### Backend
```bash
# Chạy development
npm run dev

# Build production
npm run build

# Chạy production
npm start

# Prisma commands
npx prisma migrate dev      # Tạo migration mới
npx prisma migrate deploy   # Apply migrations
npx prisma generate         # Generate client
npx prisma studio           # Mở Prisma Studio (GUI)
```

### Frontend
```bash
# Chạy development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Docker
```bash
# Build images
docker-compose build

# Chạy services
docker-compose up -d

# Xem logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Dừng và xóa containers
docker-compose down

# Xóa volumes (database)
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Lỗi: Port đã được sử dụng
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :3000
kill -9 <PID>
```

### Lỗi: Docker không khởi động
1. Đảm bảo Docker Desktop đang chạy
2. Khởi động lại Docker Desktop
3. Kiểm tra: `docker info`

### Lỗi: Database connection
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra thông tin kết nối trong .env
3. Thử: `npx prisma db push`

### Lỗi: Prisma migration
```bash
# Reset database (xóa hết data)
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset
```

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Tất cả dependencies đã được cài đặt
2. Các biến môi trường đã được cấu hình đúng
3. Docker Desktop đang chạy (nếu dùng Docker)
4. Database đã được tạo và kết nối thành công

---

## 📝 License

MIT License
