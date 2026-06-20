# Product

## Register

product

## Users
- **Phụ huynh học sinh**: Truy cập để theo dõi sự phát triển thể chất của con, xem nhận xét hằng ngày của giáo viên, cập nhật điểm danh và nhận thông báo từ nhà trường. Thường sử dụng thiết bị di động trong thời gian rảnh rỗi.
- **Admin & Giáo viên**: Quản lý hồ sơ học sinh, cập nhật chỉ số tăng trưởng, chấm công/điểm danh, gửi thông báo và xuất báo cáo định kỳ. Thường sử dụng máy tính bảng hoặc máy tính để bàn để thực hiện các tác vụ quản trị nhanh chóng.

## Product Purpose
Nhà Trẻ Hạ Mi là nền tảng quản lý trường mầm non hiện đại, số hóa toàn bộ quy trình tương tác giữa nhà trường và gia đình. Mục tiêu cốt lõi là mang lại sự an tâm tuyệt đối cho phụ huynh thông qua dữ liệu trực quan và thông tin kịp thời.

## Brand Personality
- **Ấm áp (Warm)**: Mang lại cảm giác gần gũi, an toàn như gia đình.
- **Đáng tin cậy (Trusted)**: Khoa học, chính xác trong việc hiển thị dữ liệu phát triển thể chất.
- **Tươi sáng (Vibrant)**: Sinh động, đầy năng lượng tích cực của trẻ thơ nhưng không bị trẻ con hóa hay thiếu chuyên nghiệp.

## Anti-references
- **AI Cream Slop**: Tránh màu nền vàng kem/vàng cát nhạt rập khuôn vốn tạo cảm giác "AI tạo ra".
- **SaaS Clichés**: Không sử dụng các khối thẻ (card) giống hệt nhau xếp chồng chéo lặp lại nhàm chán, tránh tiêu đề phụ viết hoa nhỏ giãn chữ (eyebrows) ở mọi phân đoạn.
- **Overdone Glassmorphism**: Không lạm dụng hiệu ứng mờ kính (glassmorphism) và các đốm màu trôi nổi (floating blobs) không mục đích làm giảm khả năng đọc của người dùng lớn tuổi.
- **Poor Contrast**: Tránh chữ xám nhạt trên nền trắng/kem gây nhức mắt và khó đọc.

## Design Principles
1. **Thiết kế hướng gia đình (Family-Centric Comfort)**: Màu sắc và bố cục phải đem lại cảm giác bình yên, ấm áp nhưng rõ ràng, sạch sẽ.
2. **Trực quan hóa khoa học (Scientific Visuals)**: Các chỉ số chiều cao, cân nặng và chuyên cần phải hiển thị bằng các biểu đồ có tương phản cao, dễ hiểu ngay lập tức.
3. **Nhịp điệu mềm mại (Soft Hierarchy)**: Các thành phần giao diện sử dụng bo góc thân thiện (`--radius-lg` & `--radius-xl`) để phù hợp với môi trường mầm non, nhưng cấu trúc căn lề, khoảng cách đệm (padding) phải cực kỳ nhất quán và cân đối để giữ vẻ chuyên nghiệp.

## Accessibility & Inclusion
- Đạt độ tương phản tối thiểu WCAG AA (tỷ lệ tương phản chữ ≥ 4.5:1).
- Hỗ trợ đầy đủ giảm chuyển động (`prefers-reduced-motion: reduce`) cho các thành phần hoạt họa Framer Motion.
- Đảm bảo vùng bấm (touch target) trên mobile tối thiểu 44x44px cho phụ huynh thao tác khi đang di chuyển.
