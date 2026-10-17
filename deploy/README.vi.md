# openGym tại gym.daffar.vn

Website: https://gym.daffar.vn

Project Coolify: **openGym Việt Nam**, môi trường **production** trên VM100.
Mã nguồn: https://github.com/thaihung34/openGym

## Đăng nhập lần đầu

1. Mở website bằng Chrome, Edge hoặc Safari.
2. Chọn **Tạo hồ sơ mới**, nhập tên của bạn rồi chọn **Tạo khóa truy cập**.
3. Xác nhận bằng Windows Hello, vân tay, khuôn mặt, mã PIN thiết bị hoặc trình quản lý khóa truy cập mà trình duyệt cung cấp.
4. Người tạo hồ sơ đầu tiên nhận quyền quản trị vì `FIRST_USER_ADMIN=1`.

Không có tài khoản hoặc mật khẩu mặc định. Những lần sau chọn **Đăng nhập bằng khóa truy cập** trên đúng địa chỉ `https://gym.daffar.vn`.

Để thêm thiết bị: trên thiết bị đã đăng nhập, mở **Cài đặt → Tài khoản → Thêm thiết bị khác**. Trên thiết bị mới chọn **Dùng mã từ thiết bị khác**, nhập mã rồi tạo khóa truy cập của thiết bị đó.

Chế độ khách chỉ lưu dữ liệu trong trình duyệt, không tạo tài khoản trên máy chủ.

## Cấu hình triển khai

- Dùng `coolify-compose.yaml`; đặt `CF_TUNNEL_TOKEN` trong secret của Coolify.
- Tunnel `opengym-gym-daffar` định tuyến `gym.daffar.vn` đến `http://web:80` trong mạng của stack.
- Frontend không publish cổng host. Cổng 8080 trên VM đã có dịch vụ khác sử dụng.
- Volume `opengym-data` được Coolify thêm tiền tố UUID của service và gắn vào `/data` của API.
- Giao diện mặc định là `vi`. Bộ dịch gồm 2.258 chuỗi giao diện và tên, mô tả, hướng dẫn của 5.632 bài tập.
- Bản dịch thư viện được tạo tự động rồi hiệu chỉnh thuật ngữ gym; chưa được chuyên gia ngôn ngữ rà soát từng bài.
- Health check API và frontend chạy mỗi 30 giây. Cloudflared không có Docker health check; kiểm tra trạng thái kết nối trong Cloudflare hoặc log container.

Sau khi cập nhật fork, dùng **More actions → Pull latest and restart** trong service Coolify để build frontend mới. Kiểm tra `/api/health`: phải trả HTTP 200 với `ok: true` và `writable: true`.

Để sao lưu, dùng tính năng xuất bản sao lưu trong ứng dụng và sao lưu volume dữ liệu của project. Không xóa volume khi cập nhật container.
