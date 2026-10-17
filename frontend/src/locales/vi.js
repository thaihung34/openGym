// Vietnamese UI strings. The complete key set is kept in sync with the shipped locale packs.
import sourceKeys from './th.js'
const vi = Object.fromEntries(Object.keys(sourceKeys).map(key => [key, key]))
Object.assign(vi, {
  Confirm: 'Xác nhận', Cancel: 'Hủy', Delete: 'Xóa', Save: 'Lưu', Import: 'Nhập', Discard: 'Bỏ',
  All: 'Tất cả', Rest: 'Nghỉ', On: 'Bật', Off: 'Tắt', Skip: 'Bỏ qua', New: 'Mới', Log: 'Ghi lại',
  Goal: 'Mục tiêu', Plan: 'Kế hoạch', Today: 'Hôm nay', Home: 'Trang chủ', Start: 'Bắt đầu',
  Resume: 'Tiếp tục', Stats: 'Thống kê', Exercises: 'Bài tập', 'By muscle': 'Theo nhóm cơ',
  'Explore muscles': 'Khám phá nhóm cơ', History: 'Lịch sử', Settings: 'Cài đặt', Freestyle: 'Tự do',
  Routine: 'Giáo án', Library: 'Thư viện', Workout: 'Buổi tập', Weight: 'Cân nặng', Progress: 'Tiến bộ',
  Account: 'Tài khoản', Language: 'Ngôn ngữ', Theme: 'Giao diện', Light: 'Sáng', Dark: 'Tối',
  'Create profile': 'Tạo hồ sơ', 'Continue without account': 'Tiếp tục không cần tài khoản',
  'Sign in': 'Đăng nhập', 'Sign out': 'Đăng xuất', 'Create account': 'Tạo tài khoản', Name: 'Tên',
  Password: 'Mật khẩu', Close: 'Đóng', Back: 'Quay lại', Next: 'Tiếp theo', Done: 'Xong', Add: 'Thêm',
  Edit: 'Chỉnh sửa', Remove: 'Xóa', Search: 'Tìm kiếm', Filter: 'Lọc', Clear: 'Xóa bộ lọc',
  'Loading…': 'Đang tải…', 'No results': 'Không có kết quả', Sets: 'Hiệp', Reps: 'Số lần',
  Time: 'Thời gian', 'Save workout': 'Lưu buổi tập', 'Finish workout': 'Kết thúc buổi tập',
  Backup: 'Sao lưu', Restore: 'Khôi phục', 'Data & backup': 'Dữ liệu và sao lưu',
  Privacy: 'Quyền riêng tư', About: 'Giới thiệu',
  'Choose a muscle to see exercises that train it.': 'Chọn nhóm cơ để xem các bài tập phù hợp.'
})
export default vi
