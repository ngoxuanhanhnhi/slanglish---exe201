# Hướng dẫn chạy Slanglish trên máy mới

## Yêu cầu
- Đã cài **Docker Desktop** (Windows/Mac) hoặc **Docker Engine** (Linux)
- Đã cài **Docker Compose**

---

## Bước 1 — Copy thư mục

Chép toàn bộ thư mục `english_app` vào máy mới (USB, ổ cứng ngoài, hoặc chia sẻ mạng).

---

## Bước 2 — Chạy app

Mở terminal, di chuyển vào thư mục vừa copy:

```bash
cd đường-dẫn-tới/english_app
```

Chạy lệnh:

```bash
docker-compose up -d
```

Lần đầu tiên sẽ mất **5–10 phút** để build (tải dependencies, compile code).

---

## Bước 3 — Kiểm tra

```bash
docker-compose ps
```

Kết quả mong đợi — 3 containers đều `Up`:

```
NAME                        STATUS
english_app_db_dev          Up (healthy)
english_app_backend_dev     Up
english_app_frontend_dev    Up
```

Nếu có lỗi, xem logs:

```bash
docker-compose logs backend --tail 30
```

---

## Bước 4 — Truy cập

Mở trình duyệt:

| Trang | URL |
|---|---|
| App (Frontend) | http://localhost:3000 |
| API (Backend) | http://localhost:5000/api/v1 |

---

## Dừng app

```bash
docker-compose down
```

## Dừng và xóa toàn bộ dữ liệu (database)

```bash
docker-compose down -v
```

> ⚠️ Lệnh `-v` sẽ **xóa sạch database**. Chỉ dùng khi muốn reset hoàn toàn.
