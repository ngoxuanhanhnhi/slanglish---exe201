# 🚀 Hướng dẫn Deploy Slanglish lên slanglish.xyz

## Tổng quan kiến trúc

```
Internet
   │
   ▼
[Nginx Reverse Proxy + SSL]   ← server VPS (port 80/443)
   ├── /          → Frontend (React/Vite build, serve static via Nginx)
   └── /api/v1/  → Backend  (Node.js/Express, port 5000)
                         │
                         └── PostgreSQL (port 5432, internal only)
```

Stack hiện tại:
- **Frontend**: React 18 + Vite → build ra static files, served qua Nginx container
- **Backend**: Node.js 20 + Express + Prisma
- **Database**: PostgreSQL 16
- **Container**: Docker Compose (đã có `Dockerfile` production-ready cho cả frontend và backend)

---

## Bước 1 — Chọn VPS / Hosting

Bạn cần 1 VPS (Virtual Private Server) chạy Linux. Đề xuất:

| Provider | Plan tối thiểu | Giá ước tính |
|---|---|---|
| **Hetzner** | CX22 — 2 vCPU, 2GB RAM | ~€4/tháng |
| **DigitalOcean** (Droplet) | 2 vCPU, 2GB RAM | ~$12/tháng |
| **Vultr** | 1 vCPU, 2GB RAM | ~$6/tháng |
| **Contabo** | 4 vCPU, 6GB RAM | ~$7/tháng |

> **Khuyến nghị**: **Hetzner CX22** — rẻ nhất, hiệu năng tốt  
> **OS**: Ubuntu 22.04 LTS

---

## Bước 2 — Trỏ DNS về VPS

Sau khi có VPS, lấy **IP public** của server (ví dụ: `103.45.12.67`).

Vào trang quản lý DNS của nhà cung cấp domain, thêm các bản ghi sau:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `103.45.12.67` | Auto |
| `A` | `www` | `103.45.12.67` | Auto |

> DNS thường mất 5–30 phút để propagate. Kiểm tra tại https://dnschecker.org

---

## Bước 3 — Chuẩn bị VPS

SSH vào server:

```bash
ssh root@103.45.12.67
```

Cài các tool cần thiết:

```bash
# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Cài Docker Compose v2
apt install docker-compose-plugin -y

# Cài Git
apt install git -y

# Cài Nginx (dùng làm reverse proxy bên ngoài, quản lý SSL)
apt install nginx certbot python3-certbot-nginx -y

# Kiểm tra
docker --version
docker compose version
nginx -v
```

---

## Bước 4 — Tạo `docker-compose.prod.yml`

Project hiện tại có `docker-compose.yml` dùng cho dev (Dockerfile.dev, hot-reload, credentials hardcode).  
Tạo file production riêng tại thư mục gốc `english_app/docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: slanglish_db
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - slanglish_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./back_end
      dockerfile: Dockerfile          # Production Dockerfile (đã có sẵn)
    container_name: slanglish_backend
    restart: always
    env_file: ./back_end/.env.prod
    ports:
      - "127.0.0.1:5000:5000"        # Chỉ bind localhost, không expose ra ngoài
    volumes:
      - ./back_end/uploads:/app/uploads   # Persist file upload
    depends_on:
      db:
        condition: service_healthy
    networks:
      - slanglish_network

  frontend:
    build:
      context: ./front_end
      dockerfile: Dockerfile          # Production Dockerfile (đã có sẵn)
    container_name: slanglish_frontend
    restart: always
    ports:
      - "127.0.0.1:3000:3000"        # Chỉ bind localhost
    depends_on:
      - backend
    networks:
      - slanglish_network

networks:
  slanglish_network:
    driver: bridge

volumes:
  postgres_data:
```

---

## Bước 5 — Tạo file `.env.prod` cho Backend

Trên server, tạo file `back_end/.env.prod`:

```bash
nano /opt/english_app/back_end/.env.prod
```

Nội dung (thay các giá trị `<...>` bằng thông tin thực):

```env
# Database
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}?schema=public"
DB_USER=slanglish_user
DB_PASSWORD=<ChangeThisToStrongPassword>
DB_NAME=slanglish_prod

# JWT — PHẢI thay bằng chuỗi ngẫu nhiên mạnh (tạo bằng lệnh bên dưới)
JWT_SECRET=<replace-with-64-char-random-string>
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production

# CORS — dùng domain thực với HTTPS
FRONTEND_URL=https://slanglish.xyz

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email@gmail.com>
SMTP_PASS=<your-gmail-app-password>
```

Tạo JWT secret mạnh:

```bash
openssl rand -base64 64
```

> ⚠️ **Không commit file `.env.prod` lên Git.** File này đã được ignore trong `.gitignore`.

---

## Bước 6 — Copy code lên server

> Không cần Git — dùng **SCP** (có sẵn trong Windows 10/11) hoặc **WinSCP** (GUI)

### Cách A — SCP (PowerShell, không cần cài thêm)

```powershell
# Chạy trong PowerShell trên máy Windows
# Copy toàn bộ project lên /opt/english_app trên VPS
scp -r E:\english_app root@103.45.12.67:/opt/english_app
```

> ⚠️ SCP sẽ copy cả `node_modules` (rất nặng, mất nhiều thời gian).  
> Khuyến nghị dùng **rsync** qua Git Bash / WSL để loại trừ:

```bash
# Trong Git Bash hoặc WSL
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  /e/english_app/ root@103.45.12.67:/opt/english_app/
```

### Cách B — WinSCP (GUI, dễ dùng)

1. Tải **WinSCP** tại https://winscp.net (miễn phí)
2. Kết nối: `SFTP` → Host: `103.45.12.67`, User: `root`, nhập Password VPS
3. Bên trái (máy bạn): mở `E:\english_app`
4. Bên phải (VPS): mở `/opt/`
5. Kéo thả thư mục `english_app` sang — **bỏ qua** các thư mục `node_modules`, `dist`, `.git`

---

Sau khi copy xong, SSH vào server:

```bash
ssh root@103.45.12.67
cd /opt/english_app

# Tạo file env production (điền nội dung như Bước 5)
nano back_end/.env.prod

# Build và chạy containers production
docker compose -f docker-compose.prod.yml up -d --build

# Kiểm tra containers đang chạy
docker compose -f docker-compose.prod.yml ps

# Xem logs backend
docker logs slanglish_backend --tail 30
```

Output mong đợi:

```
NAME                  STATUS
slanglish_db          Up (healthy)
slanglish_backend     Up
slanglish_frontend    Up
```

---

## Bước 7 — Cấu hình Nginx Reverse Proxy (trên host)

Nginx hệ thống (ngoài Docker) nhận traffic port 80/443 và forward vào containers.

Tạo config:

```bash
nano /etc/nginx/sites-available/slanglish
```

Nội dung:

```nginx
server {
    listen 80;
    server_name slanglish.xyz www.slanglish.xyz;

    # Upload size tối đa (Excel quiz files)
    client_max_body_size 20M;

    # Toàn bộ traffic → frontend container (port 3000)
    # Frontend nginx.conf đã có sẵn proxy /api → backend:5000
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt:

```bash
ln -s /etc/nginx/sites-available/slanglish /etc/nginx/sites-enabled/
nginx -t          # kiểm tra cú pháp config
systemctl reload nginx
```

---

## Bước 8 — Cài SSL (HTTPS) miễn phí với Let's Encrypt

```bash
certbot --nginx -d slanglish.xyz -d www.slanglish.xyz
```

Certbot sẽ tự động:
1. Xác thực quyền sở hữu domain qua HTTP challenge
2. Cấp SSL certificate từ Let's Encrypt
3. Sửa Nginx config thành HTTPS + tự động redirect HTTP → HTTPS

Sau khi xong, Nginx config sẽ có thêm:

```nginx
server {
    listen 443 ssl;
    server_name slanglish.xyz www.slanglish.xyz;

    ssl_certificate /etc/letsencrypt/live/slanglish.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/slanglish.xyz/privkey.pem;
    # ... (certbot tự thêm)
}
```

Certificate tự động renew mỗi 90 ngày — kiểm tra:

```bash
certbot renew --dry-run
```

---

## Bước 9 — Bật Firewall

```bash
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw enable

# Kiểm tra — port 5000 và 5432 KHÔNG được liệt kê
ufw status
```

> Port 5000 (backend) và 5432 (database) đã được bind `127.0.0.1` trong `docker-compose.prod.yml` nên không thể truy cập từ ngoài.

---

## Bước 10 — Kiểm tra toàn bộ

```bash
# Tất cả containers healthy
docker compose -f docker-compose.prod.yml ps

# Test HTTPS
curl https://slanglish.xyz/api/v1/quiz/categories

# Test redirect HTTP → HTTPS
curl -I http://slanglish.xyz
# Kết quả mong đợi: 301 Moved Permanently → https://slanglish.xyz
```

Truy cập **https://slanglish.xyz** trên browser — ✅

---

## Quy trình Update khi có code mới

```powershell
# Bước 1 — Từ máy Windows: copy code mới lên server
# (Git Bash / WSL — nhanh hơn vì bỏ qua node_modules)
rsync -avz --progress --exclude='node_modules' --exclude='dist' --exclude='.git' \
  /e/english_app/ root@103.45.12.67:/opt/english_app/

# Hoặc SCP thuần (PowerShell)
scp -r E:\english_app root@103.45.12.67:/opt/english_app
```

```bash
# Bước 2 — SSH vào server, rebuild
ssh root@103.45.12.67
cd /opt/english_app
docker compose -f docker-compose.prod.yml up -d --build

# Kiểm tra
docker compose -f docker-compose.prod.yml ps
docker logs slanglish_backend --tail 20
```

> **Prisma migrations** được tự động chạy khi backend khởi động  
> (`CMD: npx prisma migrate deploy && node dist/app.js` trong `back_end/Dockerfile`)

---

## Xử lý sự cố thường gặp

### Container backend không start
```bash
docker logs slanglish_backend --tail 50
# Thường do: DATABASE_URL sai, DB chưa healthy, JWT_SECRET thiếu
```

### DNS chưa propagate
```bash
nslookup slanglish.xyz
# Hoặc kiểm tra tại https://dnschecker.org
```

### Certbot thất bại
```bash
# Đảm bảo Nginx đang chạy và domain đã trỏ về đúng IP
systemctl status nginx
curl http://slanglish.xyz   # phải trả về response (dù là 502)
```

### Xem logs realtime
```bash
docker compose -f docker-compose.prod.yml logs -f --tail 50
```

---

## Chi phí ước tính hàng tháng

| Mục | Chi phí |
|---|---|
| VPS Hetzner CX22 | ~€4/tháng (~$4.5) |
| Domain `slanglish.xyz` | ~$10/năm (~$0.8/tháng) |
| SSL Certificate (Let's Encrypt) | **Miễn phí** |
| **Tổng** | **~$5–6/tháng** |

---

## Checklist Deploy

- [ ] VPS Ubuntu 22.04 đã mua và có IP
- [ ] DNS `slanglish.xyz` → IP VPS đã trỏ (kiểm tra dnschecker.org)
- [ ] Docker + Docker Compose đã cài trên server
- [ ] Nginx đã cài trên host
- [ ] Code đã copy lên `/opt/english_app` (qua SCP, rsync, hoặc WinSCP)
- [ ] `back_end/.env.prod` đã tạo với credentials thực (JWT secret mạnh, DB password mạnh)
- [ ] `docker-compose.prod.yml` đã tạo tại thư mục gốc
- [ ] `docker compose -f docker-compose.prod.yml up -d --build` → tất cả containers Up
- [ ] Nginx reverse proxy config đã tạo và reload
- [ ] SSL Let's Encrypt đã cài (`certbot --nginx -d slanglish.xyz -d www.slanglish.xyz`)
- [ ] Firewall `ufw` đã bật, chỉ mở port 22/80/443
- [ ] Truy cập `https://slanglish.xyz` hoạt động ✅
