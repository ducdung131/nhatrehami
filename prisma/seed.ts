import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const vietnameseNames = {
  lastNames: ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ"],
  middleNames: ["Văn", "Thị", "Đức", "Minh", "Hồng", "Thanh", "Quốc", "Ngọc"],
  firstNamesMale: ["An", "Bảo", "Đạt", "Dũng", "Hải", "Hùng", "Khang", "Long", "Minh", "Nam"],
  firstNamesFemale: ["Anh", "Chi", "Dung", "Hà", "Lan", "Linh", "Mai", "Ngọc", "Phương", "Trang"],
};

function randomEl<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomBetween(min: number, max: number) { return Math.round((Math.random() * (max - min) + min) * 10) / 10; }

const classes = ["Lớp Mầm", "Lớp Chồi", "Lớp Lá", "Lớp Búp"];

const announcements = [
  { title: "Thông báo nghỉ hè 2026", content: "Nhà trường xin thông báo lịch nghỉ hè từ ngày 15/06/2026 đến 31/08/2026. Kính mong quý phụ huynh sắp xếp đón các bé đúng giờ." },
  { title: "Ngày hội thể thao", content: "Nhà trường tổ chức ngày hội thể thao vào ngày 20/05/2026. Chương trình gồm các trò chơi vận động, thi đấu bóng rổ mini và nhảy dây." },
  { title: "Họp phụ huynh đầu năm", content: "Kính mời quý phụ huynh tham dự buổi họp đầu năm học 2025-2026 vào lúc 8:00 sáng ngày 05/09/2025 tại hội trường nhà trường." },
  { title: "Tiêm chủng định kỳ", content: "Nhà trường phối hợp với Trung tâm Y tế tổ chức tiêm chủng cho các bé vào ngày 10/04/2026. Phụ huynh vui lòng ký giấy đồng ý." },
  { title: "Chương trình ngoại khóa tháng 3", content: "Tháng 3, nhà trường tổ chức tham quan vườn thú cho các bé lớp Lá và lớp Chồi. Chi phí: 100.000đ/bé." },
  { title: "Thực đơn tháng 6", content: "Thực đơn mới đã được cập nhật, đảm bảo dinh dưỡng cân bằng với đa dạng món ăn phù hợp cho trẻ mầm non." },
];

const teacherComments = [
  "Bé ngoan, chăm chỉ học bài, tham gia tích cực các hoạt động nhóm.",
  "Bé tiến bộ rõ rệt trong kỹ năng giao tiếp, biết chia sẻ đồ chơi với bạn.",
  "Bé ăn ngon, ngủ tốt, sức khỏe ổn định. Bé cần rèn thêm kỹ năng tự lập.",
  "Bé vui vẻ, hòa đồng, thích tham gia các hoạt động ngoại khóa.",
  "Bé đã biết tự mặc quần áo, tự ăn cơm. Cần cải thiện kỹ năng đếm số.",
  "Bé rất sáng tạo trong giờ vẽ, thích kể chuyện và hát.",
  "Bé ngoan, hay giúp đỡ bạn, nhưng đôi khi còn nhút nhát khi phát biểu.",
  "Bé phát triển tốt về thể chất, tích cực trong giờ thể dục.",
  "Bé tiến bộ nhiều trong việc nhận biết chữ cái và số.",
  "Bé vui vẻ, hoạt bát, thích khám phá môi trường xung quanh.",
  "Bé đã quen với nề nếp lớp học, biết xếp hàng và lắng nghe cô giáo.",
  "Bé ăn uống tốt, tăng cân đều, sức khỏe tốt trong tháng này.",
];

const healthNotes = [
  "Sức khỏe tốt, không có vấn đề gì.",
  "Bé bị ho nhẹ đầu tháng, đã khỏi.",
  "Sức khỏe ổn định, cần uống nhiều nước.",
  "Bé bị dị ứng nhẹ, đã được theo dõi.",
  null, null, null, null,
];

async function main() {
  console.log("🌱 Starting optimized database seed...");

  // Clean
  await prisma.attendance.deleteMany();
  await prisma.growthRecord.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.user.deleteMany();

  // Create admin
  const admin = await prisma.user.create({
    data: { email: "admin@hami.vn", role: "ADMIN", fullName: "Admin Hạ Mi" },
  });
  console.log("✅ Admin created");

  const parentUsersData = [];
  const parentsData = [];
  const studentsData = [];
  const growthRecordsData = [];
  const attendanceRecordsData = [];

  for (let i = 0; i < 20; i++) {
    const isMale = i < 10;
    const lastName = vietnameseNames.lastNames[i % 10];
    const middleName = isMale ? randomEl(vietnameseNames.middleNames.filter(n => ["Văn", "Đức", "Minh", "Quốc"].includes(n))) : randomEl(vietnameseNames.middleNames.filter(n => ["Thị", "Hồng", "Thanh", "Ngọc"].includes(n)));
    const parentFirst = isMale ? randomEl(vietnameseNames.firstNamesMale) : randomEl(vietnameseNames.firstNamesFemale);
    const parentName = `${lastName} ${middleName} ${parentFirst}`;
    const childFirst = isMale ? randomEl(vietnameseNames.firstNamesFemale) : randomEl(vietnameseNames.firstNamesMale);
    const childMiddle = !isMale ? randomEl(["Văn", "Đức", "Minh"]) : randomEl(["Thị", "Ngọc", "Hồng"]);
    const childName = `${lastName} ${childMiddle} ${childFirst}`;

    const userId = `usr-parent-${i + 1}`;
    const parentId = `prt-parent-${i + 1}`;
    const studentId = `std-child-${i + 1}`;

    parentUsersData.push({
      id: userId,
      email: `parent${i + 1}@hami.vn`,
      role: "PARENT" as const,
      fullName: parentName,
    });

    parentsData.push({
      id: parentId,
      userId,
      fullName: parentName,
      phone: `09${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
    });

    const birthYear = 2021 + Math.floor(Math.random() * 3);
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = 1 + Math.floor(Math.random() * 28);

    studentsData.push({
      id: studentId,
      parentId,
      fullName: childName,
      birthDate: new Date(birthYear, birthMonth, birthDay),
      gender: i % 2 === 0 ? "MALE" as const : "FEMALE" as const,
      className: classes[i % 4],
      address: `${100 + i} Đường ${randomEl(["Trần Phú", "Nguyễn Huệ", "Lê Lợi", "Hai Bà Trưng"])}, Bình Sơn, Quảng Ngãi`,
    });

    // 12 months of growth records
    let height = randomBetween(78, 88);
    let weight = randomBetween(10, 13);

    for (let m = 0; m < 12; m++) {
      const date = new Date(2025, 6 + m, 15);
      height += randomBetween(0.5, 1.5);
      weight += randomBetween(0.1, 0.4);

      growthRecordsData.push({
        studentId,
        date,
        height: Math.round(height * 10) / 10,
        weight: Math.round(weight * 10) / 10,
        teacherComment: teacherComments[m % teacherComments.length],
        healthNote: randomEl(healthNotes),
      });
    }

    // Attendance records (last 60 school days)
    for (let d = 0; d < 60; d++) {
      const date = new Date(2026, 0, 6 + d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const rand = Math.random();
      const status = rand < 0.85 ? "PRESENT" as const : rand < 0.93 ? "LATE" as const : "ABSENT" as const;

      attendanceRecordsData.push({
        studentId,
        date,
        status,
        note: status === "ABSENT" ? "Nghỉ ốm" : null,
      });
    }
  }

  // Batch insert all records
  console.log("⚡ Inserting Parent Users...");
  await prisma.user.createMany({ data: parentUsersData });

  console.log("⚡ Inserting Parent Details...");
  await prisma.parent.createMany({ data: parentsData });

  console.log("⚡ Inserting Students...");
  await prisma.student.createMany({ data: studentsData });

  console.log("⚡ Inserting Growth Records...");
  await prisma.growthRecord.createMany({ data: growthRecordsData });

  console.log("⚡ Inserting Attendance logs...");
  await prisma.attendance.createMany({ data: attendanceRecordsData });

  // Announcements
  const announcementsData = announcements.map((ann) => ({
    title: ann.title,
    content: ann.content,
    createdById: admin.id,
    targetClass: Math.random() > 0.5 ? randomEl(classes) : null,
  }));

  console.log("⚡ Inserting Announcements...");
  await prisma.announcement.createMany({ data: announcementsData });

  console.log("\n🎉 Optimized Seed Completed Successfully!");
  console.log("📧 Admin: admin@hami.vn");
  console.log("📧 Parent: parent1@hami.vn - parent20@hami.vn");
}

main().catch(console.error).finally(() => prisma.$disconnect());
