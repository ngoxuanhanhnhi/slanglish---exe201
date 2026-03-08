# 📦 Hướng Dẫn Cài Đặt Slanglish - Từ Đầu

Hướng dẫn này dành cho **máy tính hoàn toàn mới**, chưa cài đặt bất cứ phần mềm phát triển nào.

---

## 📋 Tổng Quan

**Slanglish** là ứng dụng web học tiếng Anh hiện đại, chạy bằng **Docker**. 

### Ưu điểm của Docker:
✅ **Không cần cài Node.js, PostgreSQL** hay các công cụ phức tạp  
✅ **Chỉ cần Docker Desktop** - một phần mềm duy nhất  
✅ **Chạy được trên Windows, Mac, Linux** - giống hệt nhau  
✅ **Tự động setup mọi thứ** - database, backend, frontend  

### Thời gian cài đặt ước tính:
- ⏱️ **15-20 phút** cho người lần đầu
- ⏱️ **5-10 phút** nếu đã quen Docker

---

## 🖥️ Yêu Cầu Hệ Thống

### Windows:
- **Windows 10/11** (64-bit)
- **4GB RAM** trở lên (khuyến nghị 8GB)
- **20GB ổ cứng** còn trống
- **Bật Virtualization** trong BIOS/UEFI

### macOS:
- **macOS 11 Big Sur** trở lên
- **4GB RAM** trở lên (khuyến nghị 8GB)
- **20GB ổ cứng** còn trống
- Chip **Intel** hoặc **Apple Silicon** (M1/M2/M3)

### Linux:
- **Ubuntu 20.04+**, **Debian 11+**, hoặc các distro tương tự
- **4GB RAM** trở lên
- **20GB ổ cứng** còn trống
- Kernel **5.0+**

---

## 🚀 Bước 1: Cài Đặt Docker Desktop

Docker Desktop là phần mềm **DUY NHẤT** bạn cần cài đặt.

### 📥 Windows

#### 1.1. Kiểm tra Virtualization (Ảo hóa)

Trước khi cài Docker, cần đảm bảo Virtualization đã được bật:

**Cách kiểm tra:**
1. Nhấn **`Ctrl + Shift + Esc`** mở Task Manager
2. Chọn tab **Performance** → **CPU**
3. Kiểm tra dòng **"Virtualization"**
   - ✅ Nếu hiện **"Enabled"** → OK, bỏ qua bước 1.2
   - ❌ Nếu hiện **"Disabled"** → Làm theo bước 1.2

#### 1.2. Bật Virtualization trong BIOS (nếu cần)

**Lưu ý:** Cách vào BIOS khác nhau tùy hãng laptop/PC:

| Hãng | Phím thường dùng |
|------|------------------|
| Dell | F2, F12, Delete |
| HP | F10, Esc |
| Lenovo | F1, F2 |
| Asus | F2, Delete |
| Acer | F2, Delete |
| MSI | Delete, F2 |

**Các bước:**
1. **Khởi động lại máy tính**
2. **Liên tục nhấn phím** (F2/Delete/...) ngay khi máy bật
3. Tìm mục có tên: **"Virtualization Technology"**, **"Intel VT-x"**, **"AMD-V"**, hoặc **"SVM Mode"**
4. Đổi từ **Disabled** → **Enabled**
5. **Save & Exit** (thường là F10)
6. Máy sẽ khởi động lại

#### 1.3. Tải và Cài Docker Desktop

1. Truy cập: **https://www.docker.com/products/docker-desktop/**
2. Nhấn **"Download for Windows"**
3. Chờ tải file **`Docker Desktop Installer.exe`** (khoảng 500MB)
4. **Chạy file installer** vừa tải về
5. Trong cửa sổ cài đặt:
   - ✅ Tick chọn: **"Use WSL 2 instead of Hyper-V"** (khuyến nghị)
   - ✅ Tick chọn: **"Add shortcut to desktop"**
6. Nhấn **"Ok"** và đợi cài đặt (3-5 phút)
7. Nhấn **"Close and restart"** khi yêu cầu
8. Máy tính sẽ **khởi động lại**

#### 1.4. Khởi động Docker Desktop

1. Sau khi máy khởi động lại, mở **Docker Desktop** (biểu tượng cá voi xanh)
2. Lần đầu có thể yêu cầu:
   - **Docker Desktop needs privileged access** → Nhấn **"OK"**
   - **WSL 2 installation is incomplete** → Làm theo hướng dẫn cài WSL2 (nếu có)
3. Chờ Docker khởi động (30-60 giây)
4. Khi thấy **"Docker Desktop is running"** (cá voi xanh không xoay nữa) → Hoàn tất!

#### 1.5. Kiểm tra Docker đã cài thành công

1. Nhấn **`Win + R`**
2. Gõ **`powershell`** và nhấn **Enter**
3. Trong cửa sổ PowerShell, gõ:

```powershell
docker --version
```

Kết quả mong đợi:
```
Docker version 24.0.x, build xxxxxxx
```

4. Tiếp tục kiểm tra Docker Compose:

```powershell
docker-compose --version
```

Kết quả mong đợi:
```
Docker Compose version v2.x.x
```

✅ **Nếu cả 2 lệnh đều hiển thị version → Docker đã cài đặt thành công!**

---

### 🍎 macOS

#### 1.1. Tải Docker Desktop

1. Truy cập: **https://www.docker.com/products/docker-desktop/**
2. Nhấn **"Download for Mac"**
3. Chọn phiên bản phù hợp:
   - **Mac with Intel chip** → Chọn bản Intel
   - **Mac with Apple silicon** (M1/M2/M3) → Chọn bản Apple Silicon

#### 1.2. Cài đặt

1. Mở file **`Docker.dmg`** vừa tải về
2. **Kéo biểu tượng Docker** vào thư mục **Applications**
3. Mở **Finder** → **Applications** → Tìm và mở **Docker**
4. Lần đầu macOS sẽ hỏi:
   - **"Docker" is an app downloaded from the Internet. Are you sure...?**
   - Nhấn **"Open"**
5. Docker có thể yêu cầu mật khẩu Mac → Nhập mật khẩu của bạn
6. Chờ Docker khởi động (30-60 giây)
7. Khi thấy **cá voi xanh** trên thanh menu bar (góc trên bên phải) → Hoàn tất!

#### 1.3. Kiểm tra Docker

1. Mở **Terminal** (Cmd + Space → gõ "Terminal")
2. Chạy lệnh:

```bash
docker --version
docker-compose --version
```

Kết quả mong đợi:
```
Docker version 24.0.x, build xxxxxxx
Docker Compose version v2.x.x
```

✅ **Thành công!**

---

### 🐧 Linux (Ubuntu/Debian)

#### 1.1. Cài đặt Docker Engine

Mở **Terminal** và chạy lần lượt các lệnh sau:

```bash
# 1. Cập nhật hệ thống
sudo apt-get update

# 2. Cài các gói cần thiết
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 3. Thêm Docker's GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Thêm Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Cài Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. Cho phép user hiện tại dùng Docker (không cần sudo)
sudo usermod -aG docker $USER

# 7. Khởi động Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### 1.2. Đăng xuất và đăng nhập lại

Để áp dụng quyền Docker cho user, **đăng xuất** khỏi hệ thống rồi **đăng nhập lại**.

#### 1.3. Kiểm tra Docker

```bash
docker --version
docker compose version  # Lưu ý: "compose" không có dấu gạch nối
```

Kết quả mong đợi:
```
Docker version 24.0.x, build xxxxxxx
Docker Compose version v2.x.x
```

✅ **Thành công!**

---

## 📂 Bước 2: Lấy Source Code

Có 2 cách để lấy source code của Slanglish:

### Cách 1: Giải nén file ZIP (Đơn giản nhất)

1. Nếu bạn nhận source code dạng file **ZIP**
2. **Giải nén** vào một thư mục, ví dụ:
   - Windows: `E:\slanglish` hoặc `C:\Users\<tên_bạn>\slanglish`
   - macOS/Linux: `~/slanglish`

### Cách 2: Clone từ Git (Nếu có repository)

#### 2.1. Cài Git (nếu chưa có)

**Windows:**
- Tải Git từ: https://git-scm.com/download/win
- Chạy installer và nhấn Next → Next → Install

**macOS:**
```bash
# Cài Homebrew nếu chưa có
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài Git
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

#### 2.2. Clone repository

```bash
git clone <repository-url>
cd slanglish
```

---

## ⚙️ Bước 3: Cấu Hình Environment Variables

Ứng dụng cần 2 file cấu hình **`.env`** (environment variables).

### 3.1. Backend Environment

#### Windows:

1. Mở **File Explorer** và truy cập thư mục `slanglish\back_end\`
2. Nhấn chuột phải → **New** → **Text Document**
3. Đặt tên file là: **`.env`** (bao gồm dấu chấm ở đầu)
   - Windows có thể cảnh báo về đổi tên → Nhấn **"Yes"**
4. Nhấn chuột phải vào file `.env` → **Open with** → **Notepad**
5. Dán nội dung sau:

```env
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
EMAIL_FROM=Slanglish <noreply@slanglish.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

6. **Lưu file** (Ctrl+S)

#### macOS/Linux:

```bash
cd slanglish/back_end
nano .env
```

Dán nội dung giống như trên, sau đó:
- Nhấn **`Ctrl + O`** → Enter (để lưu)
- Nhấn **`Ctrl + X`** (để thoát)

### 3.2. Frontend Environment

#### Windows:

1. Truy cập thư mục `slanglish\front_end\`
2. Tạo file **`.env`** tương tự như trên
3. Mở bằng Notepad và dán:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

4. **Lưu file**

#### macOS/Linux:

```bash
cd slanglish/front_end
nano .env
```

Dán nội dung trên, sau đó Ctrl+O → Enter → Ctrl+X.

---

## 🎯 Bước 4: Chạy Ứng Dụng

### 4.1. Mở Terminal

**Windows:**
1. Nhấn **`Win + R`**
2. Gõ **`powershell`**
3. Nhấn **Enter**

**macOS/Linux:**
1. Mở **Terminal**

### 4.2. Di chuyển vào thư mục project

**Windows:**
```powershell
cd E:\slanglish
# Hoặc đường dẫn nơi bạn lưu project
```

**macOS/Linux:**
```bash
cd ~/slanglish
# Hoặc đường dẫn nơi bạn lưu project
```

### 4.3. Khởi động ứng dụng

Chạy lệnh sau (áp dụng cho cả Windows/Mac/Linux):

```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Giải thích:**
- `-f docker-compose.dev.yml`: Sử dụng file cấu hình development
- `up`: Khởi động các containers
- `-d`: Chạy ở chế độ nền (detached mode)

### 4.4. Quá trình khởi động

**Lần đầu chạy** sẽ mất **2-5 phút** vì Docker cần:
- ⏬ Tải các Docker images (Node.js, PostgreSQL)
- 🔨 Build backend và frontend
- 🗄️ Tạo database
- ⚡ Chạy migrations

Bạn sẽ thấy output tương tự:
```
[+] Building 120.5s (24/24) FINISHED
[+] Running 3/3
 ✔ Container slanglish_db_dev        Started
 ✔ Container slanglish_backend_dev   Started  
 ✔ Container slanglish_frontend_dev  Started
```

### 4.5. Kiểm tra containers đang chạy

```bash
docker ps
```

Bạn sẽ thấy 3 containers:
```
CONTAINER ID   IMAGE                    STATUS         PORTS                    NAMES
xxxxxxxxxxxx   slanglish-frontend      Up 30 seconds  0.0.0.0:3000->3000/tcp   slanglish_frontend_dev
xxxxxxxxxxxx   slanglish-backend       Up 30 seconds  0.0.0.0:5000->5000/tcp   slanglish_backend_dev
xxxxxxxxxxxx   postgres:16-alpine      Up 30 seconds  0.0.0.0:5432->5432/tcp   slanglish_db_dev
```

### 4.6. Xem logs (tùy chọn)

Để xem logs của ứng dụng:

```bash
# Xem tất cả logs
docker-compose -f docker-compose.dev.yml logs -f

# Hoặc xem từng container riêng
docker logs slanglish_frontend_dev -f
docker logs slanglish_backend_dev -f
```

Nhấn **`Ctrl + C`** để thoát khỏi chế độ xem logs.

---

## 🌐 Bước 5: Truy Cập Ứng Dụng

### 5.1. Mở trình duyệt

Sử dụng trình duyệt hiện đại như:
- ✅ **Google Chrome** (khuyến nghị)
- ✅ **Microsoft Edge**
- ✅ **Mozilla Firefox**
- ✅ **Safari** (macOS)

### 5.2. Truy cập

Truy cập URL: **http://localhost:3000**

Bạn sẽ thấy trang **Đăng nhập** của Slanglish! 🎉

### 5.3. Tạo tài khoản

1. Nhấn vào link **"Đăng ký ngay"** hoặc **"Create one"**
2. Điền thông tin:
   - **Họ và tên**: Tên của bạn
   - **Email**: Email hợp lệ (có thể dùng email giả như test@example.com)
   - **Mật khẩu**: Tối thiểu 6 ký tự
   - **Xác nhận mật khẩu**: Nhập lại mật khẩu
3. Nhấn **"Đăng ký"**
4. Bạn sẽ được chuyển về trang đăng nhập
5. Đăng nhập với email và mật khẩu vừa tạo
6. **Chào mừng đến với Slanglish!** 🚀

### 5.4. Các URL quan trọng

| Dịch vụ | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Giao diện người dùng |
| **Backend API** | http://localhost:5000/api/v1 | API endpoints |
| **Health Check** | http://localhost:5000/api/v1/health | Kiểm tra backend hoạt động |
| **Prisma Studio** | http://localhost:5555 | Xem database (sau khi chạy lệnh) |

---

## 🎓 Sử Dụng Cơ Bản

### Dashboard
- Xem thống kê học tập của bạn
- Số từ vựng đã học
- Điểm quiz cao nhất
- Tiến độ học tập

### Vocabulary (Từ vựng)
- Danh sách từ vựng theo chủ đề
- Thêm từ vựng mới
- Ôn tập flashcard

### Lessons (Bài học)
- Các bài học tiếng Anh
- Theo dõi tiến độ học
- Đánh dấu hoàn thành

### Quiz (Bài kiểm tra)
- Làm bài kiểm tra
- Xem kết quả và giải thích
- Lưu lại điểm số

### Profile (Hồ sơ)
- Cập nhật thông tin cá nhân
- Đổi mật khẩu
- Xem lịch sử học tập

---

## 🔧 Quản Lý Ứng Dụng

### Dừng ứng dụng

```bash
docker-compose -f docker-compose.dev.yml down
```

### Khởi động lại

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Xem logs

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### Xem database

```bash
docker exec -it slanglish_backend_dev npx prisma studio
```

Truy cập: http://localhost:5555

---

## 🐛 Xử Lý Lỗi Thường Gặp

### ❌ Lỗi: "Docker is not running"

**Nguyên nhân:** Docker Desktop chưa khởi động

**Giải pháp:**
1. Mở **Docker Desktop**
2. Đợi cho đến khi thấy **"Docker Desktop is running"**
3. Thử lại lệnh

---

### ❌ Lỗi: "port is already allocated" hoặc "Port 3000 already in use"

**Nguyên nhân:** Có ứng dụng khác đang sử dụng port 3000 hoặc 5000

**Giải pháp Windows:**
```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay PID bằng số tìm được)
taskkill /PID <PID> /F
```

**Giải pháp macOS/Linux:**
```bash
# Tìm và kill process
lsof -ti:3000 | xargs kill -9
```

---

### ❌ Lỗi: "Cannot connect to the Docker daemon"

**Nguyên nhân:** Docker daemon chưa chạy

**Giải pháp:**

**Windows/macOS:**
- Mở Docker Desktop
- Đợi cho đến khi icon cá voi không xoay nữa

**Linux:**
```bash
sudo systemctl start docker
```

---

### ❌ Lỗi: "Virtualization is not enabled" (Windows)

**Nguyên nhân:** Chưa bật Virtualization trong BIOS

**Giải pháp:**
- Xem lại **Bước 1.2** phía trên

---

### ❌ Lỗi: "Network Error" khi truy cập localhost:3000

**Nguyên nhân:** Containers chưa khởi động xong hoặc backend chưa sẵn sàng

**Giải pháp:**
1. Kiểm tra containers đang chạy:
```bash
docker ps
```

2. Xem logs của backend:
```bash
docker logs slanglish_backend_dev
```

3. Đợi thêm 30 giây rồi refresh lại trang
4. Nếu vẫn lỗi, restart containers:
```bash
docker-compose -f docker-compose.dev.yml restart
```

---

### ❌ Lỗi: "Cannot find file .env"

**Nguyên nhân:** Chưa tạo file `.env` hoặc tạo sai vị trí

**Giải pháp:**
- Xem lại **Bước 3** và đảm bảo file `.env` ở đúng thư mục:
  - `back_end/.env`
  - `front_end/.env`

---

### ❌ Lỗi khi chạy trên Windows: "The system cannot find the path specified"

**Nguyên nhân:** Đường dẫn có dấu tiếng Việt hoặc khoảng trắng

**Giải pháp:**
- Di chuyển project vào thư mục có tên không chứa:
  - ❌ Tiếng Việt: `C:\Users\Nguyễn Văn A\slanglish`
  - ❌ Khoảng trắng: `C:\My Project\slanglish`
  - ✅ OK: `E:\slanglish` hoặc `C:\projects\slanglish`

---

## 🆘 Lệnh Reset Hoàn Toàn

Nếu mọi cách đều thất bại, hãy reset hoàn toàn:

```bash
# 1. Dừng và xóa containers
docker-compose -f docker-compose.dev.yml down -v

# 2. Xóa images
docker rmi slanglish-backend slanglish-frontend

# 3. Xóa volumes
docker volume prune -f

# 4. Build và chạy lại từ đầu
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề không nằm trong danh sách trên:

1. **Kiểm tra logs chi tiết:**
```bash
docker-compose -f docker-compose.dev.yml logs --tail=100
```

2. **Kiểm tra Docker đang chạy:**
```bash
docker info
```

3. **Kiểm tra disk space:**
```bash
docker system df
```

4. **Xóa cache Docker (giải phóng dung lượng):**
```bash
docker system prune -a
```

---

## ✅ Checklist Hoàn Thành

Sau khi làm theo hướng dẫn, bạn có thể tick vào checklist này:

- [ ] ✅ Docker Desktop đã cài đặt và chạy
- [ ] ✅ Source code đã tải về và giải nén
- [ ] ✅ File `.env` đã tạo ở `back_end/` và `front_end/`
- [ ] ✅ Đã chạy lệnh `docker-compose -f docker-compose.dev.yml up -d`
- [ ] ✅ 3 containers đều hiển thị trong `docker ps`
- [ ] ✅ Truy cập http://localhost:3000 thành công
- [ ] ✅ Đã tạo tài khoản và đăng nhập được

**Nếu tất cả đều tick ✅ → Chúc mừng! Bạn đã cài đặt thành công Slanglish! 🎉**

---

## 📚 Tài Liệu Tham Khảo

- [Docker Desktop Documentation](https://docs.docker.com/desktop/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [README.md](./README.md) - Hướng dẫn chi tiết cho developers

---

**Happy Learning! 🚀📖**

_Slanglish - Learn English the Smart Way_
