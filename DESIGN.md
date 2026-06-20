---
name: nhatrehami
description: Hệ thống quản lý trường mầm non Nhà Trẻ Hạ Mi
colors:
  primary: "#FFB86C"
  primary-dark: "#E6A050"
  secondary: "#A8E6CF"
  secondary-dark: "#7DD4B0"
  neutral-bg: "#FFF8F0"
  neutral-card: "#FFFFFF"
  text-primary: "#333333"
  text-secondary: "#666666"
  border-color: "#E8E0D8"
typography:
  display:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  card-container:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Nhà Trẻ Hạ Mi

## 1. Overview

**Creative North Star: "The Radiant Kindergarten Haven" (Khu Vườn Hạ Mi Rực Sáng)**

Hệ thống thiết kế của Nhà Trẻ Hạ Mi hướng tới việc kiến tạo một không gian số tràn ngập sự ấm áp, an toàn và đầy cảm hứng tăng trưởng cho trẻ nhỏ, đồng thời duy trì tính khoa học, chuẩn mực cho phụ huynh và nhà quản trị. Chúng tôi từ chối sự lạnh lùng của các bảng màu tối góc cạnh (SaaS tech-clichés) và sự hỗn loạn của các hiệu ứng bong bóng hay gradient lòe loẹt mất kiểm soát.

**Key Characteristics:**
- **Thân thiện & Mềm mại**: Bo góc lớn (`--radius-xl` và `--radius-lg`), khoảng cách đệm rộng rãi để tạo sự thoải mái cho thị giác phụ huynh.
- **Tương phản rõ ràng**: Dữ liệu sức khỏe và thông báo phải luôn dễ đọc với chữ tối màu tương phản cao trên nền sáng sạch sẽ.
- **Tinh tế, Tiết chế**: Các chuyển động nhẹ nhàng, không lạm dụng hiệu ứng bay bổng hay nhấp nháy làm xao nhãng nhiệm vụ chính.

## 2. Colors

Bảng màu được lấy cảm hứng từ thiên nhiên và thế giới trẻ thơ: màu cam đất nhẹ của nắng ấm, màu xanh bạc hà của lá non, trên nền kem sáng ấm áp được bổ trợ bởi các vùng trắng tinh khiết tạo nhịp điệu.

### Primary
- **Mầm Non Orange** (#FFB86C / oklch(81.5% 0.15 65.5)): Màu cam đào dịu ngọt, đại diện cho năng lượng ấm áp, sự ân cần và hạnh phúc của trẻ nhỏ. Sử dụng cho các nút hành động chính, các điểm nhấn quan trọng.

### Secondary
- **Lá Non Mint** (#A8E6CF / oklch(88.3% 0.11 150)): Màu xanh lá bạc hà dịu nhẹ, tượng trưng cho sự phát triển khỏe mạnh và môi trường an toàn. Dùng cho các điểm nhấn phụ, biểu đồ tăng trưởng sức khỏe.

### Neutral
- **Hạ Mi Cream** (#FFF8F0 / oklch(98.1% 0.015 70)): Màu nền chủ đạo, mang sắc ấm áp dễ chịu hơn màu trắng tinh khiết thông thường.
- **Pure Canvas** (#FFFFFF): Màu của các khối card chứa nội dung, giúp nổi bật thông tin trên nền kem nhẹ.
- **Charcoal Ink** (#333333 / oklch(27.4% 0 0)): Màu chữ chính, đảm bảo độ tương phản cao vượt qua tiêu chuẩn WCAG AA.
- **Warm Sand Border** (#E8E0D8): Đường viền mềm mại gắn kết các khối giao diện.

### Named Rules
**The Rarity Accent Rule.** Các gam màu nóng (Primary Orange) chỉ được chiếm tối đa 10% bề mặt của bất kỳ màn hình nào. Sự tiết chế tạo ra điểm nhấn đắt giá, tránh cảm giác chói mắt hoặc mất đi tính chuyên nghiệp.

## 3. Typography

**Display Font:** Nunito (với fallback system-ui, sans-serif) - Thân thiện, bo tròn nhẹ nhàng ở các nét chữ, tạo cảm giác dễ gần.
**Body Font:** Inter (với fallback system-ui, sans-serif) - Cực kỳ rõ ràng, tối ưu hóa độ đọc trên màn hình di động.

**Character:** Sự kết hợp hoàn hảo giữa Nunito đầy cá tính ở tiêu đề lớn và Inter trung tính, dễ đọc ở phần nội dung chi tiết.

### Hierarchy
- **Display** (Extra Bold (800), clamp(2rem, 5vw, 3.5rem), 1.2): Sử dụng cho tiêu đề trang chính, chào mừng, con số nổi bật ở landing page.
- **Headline** (Bold (700), 1.75rem, 1.3): Tiêu đề các phần lớn hoặc tiêu đề thẻ nội dung lớn.
- **Title** (Semi Bold (600), 1.25rem, 1.4): Tiêu đề thẻ nội dung vừa hoặc tiêu đề bảng.
- **Body** (Regular (400), 1rem, 1.5): Nội dung văn bản thường, nhận xét của giáo viên, giới hạn độ rộng dòng tối đa 75ch.
- **Label** (Medium (500), 0.875rem, 1.4): Nhãn nhập liệu, chú thích biểu đồ, trạng thái điểm danh.

### Named Rules
**The Bold Display Rule.** Tiêu đề lớn (Display/Headline) luôn sử dụng Nunito với độ dày tối thiểu 700 để tạo tính nhận diện thương hiệu rõ rệt. Không dùng chữ viết hoa hoàn toàn (all-caps) cho nội dung dài hoặc các tiêu đề phụ để tránh cảm giác thô cứng.

## 4. Elevation

Nhà Trẻ Hạ Mi sử dụng triết lý phẳng có phân lớp (Layered Flat). Chúng tôi không lạm dụng hiệu ứng đổ bóng mờ ảo (soft shadow) khắp nơi, thay vào đó chiều sâu được phân cấp bằng màu nền và các viền mảnh có sắc ấm nhẹ. Bóng đổ chỉ xuất hiện để biểu thị trạng thái tương tác vật lý (như thẻ được hover hoặc hộp thoại nổi).

### Shadow Vocabulary
- **Soft Ambient** (`box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07)`): Dùng cho các thẻ nội dung ở trạng thái bình thường để tách biệt nhẹ nhàng khỏi nền kem.
- **Active Lift** (`box-shadow: 0 4px 25px -5px rgba(0, 0, 0, 0.08)`): Xuất hiện khi di chuột qua các thẻ hành động, biểu thị sự sẵn sàng click.

### Named Rules
**The Border Over Shadow Rule.** Luôn ưu tiên dùng đường viền mảnh 1px màu `#E8E0D8` kết hợp với màu nền trắng để phân chia vùng nội dung, thay vì đổ bóng rộng màu xám đậm.

## 5. Components

### Buttons
- **Shape:** Bo góc lớn (`12px` / `--radius-lg`) tạo sự mềm mại, thân thiện.
- **Primary:** Gradient cam đào (`#FFB86C` sang `#E6A050`), chữ trắng (`#FFFFFF`), đệm trong (`12px 32px`).
- **Hover / Focus:** Dịch chuyển nhẹ lên trên (`translateY(-2px)`) kèm theo hiệu ứng bóng đổ cam ấm nhẹ tỏa rộng.

### Cards / Containers
- **Corner Style:** Bo góc lớn (`24px` / `--radius-xl`) để thích hợp với không gian trẻ thơ.
- **Background:** Trắng (`#FFFFFF`) trên nền trang kem (`#FFF8F0`).
- **Shadow Strategy:** Đổ bóng nhẹ `Soft Ambient` ở trạng thái tĩnh, chuyển sang `Active Lift` khi hover.
- **Border:** Viền mảnh `1px solid var(--border-light)`.
- **Internal Padding:** Rộng rãi (`24px` hoặc `32px` trên màn hình lớn) để tạo nhịp thở tốt cho thông tin.

### Inputs / Fields
- **Style:** Bo góc vừa (`12px` / `--radius-lg`), nền nhạt (`var(--bg-muted)`), viền mảnh (`var(--border-color)`).
- **Focus:** Viền chuyển màu cam chính (`#FFB86C`) kết hợp vòng hào quang mỏng mờ (`focus:ring-2 focus:ring-primary/30`).

### Navigation
- **Header/Navbar:** Sử dụng hiệu ứng mờ nền (`backdrop-filter: blur(20px)`) kết hợp nền trắng đục nhẹ (`rgba(255, 255, 255, 0.8)`), giúp giữ liên kết thị giác khi cuộn trang. Chữ menu chuyển từ xám đậm sang cam đào khi di chuột.

## 6. Do's and Don'ts

### Do:
- **Do** Sử dụng màu nền kem sáng ấm áp `#FFF8F0` kết hợp với thẻ nội dung màu trắng `#FFFFFF` để phân chia giao diện sạch sẽ.
- **Do** Luôn kiểm tra độ tương phản của chữ nội dung (phải đạt độ tương phản tối thiểu 4.5:1 đối với văn bản thường).
- **Do** Sử dụng bo góc lớn (`12px` - `24px`) cho các thẻ và nút bấm để tạo sự thân thiện phù hợp với môi trường mầm non.
- **Do** Áp dụng `@media (prefers-reduced-motion: reduce)` để tắt hoặc tối giản chuyển động của các cấu phần Framer Motion đối với thiết bị cấu hình yếu hoặc người dùng nhạy cảm.

### Don't:
- **Don't** Sử dụng màu vàng kem/vàng cát rập khuôn của AI làm màu nền body đơn điệu mà không có sự cân bằng từ các vùng trắng sạch sẽ.
- **Don't** Lạm dụng hiệu ứng mờ kính (glassmorphism) hay bóng màu trôi nổi (blobs) trên trang quản trị hoặc dashboard nội bộ gây rối mắt và khó đọc.
- **Don't** Viết hoa toàn bộ tiêu đề phụ nhỏ có khoảng cách chữ rộng (eyebrow text) trên đầu mỗi phần để tránh cảm giác giống bản thiết kế rập khuôn của AI.
- **Don't** Đổ bóng đậm hoặc sử dụng bo góc nhọn hoắt (< 6px) tạo cảm giác khô cứng của các ứng dụng doanh nghiệp (Enterprise SaaS).
- **Don't** Cho phép chữ nội dung tràn hoặc đè lên nhau trên màn hình di động; luôn thiết kế đáp ứng tỉ mỉ từ mobile lên desktop.
