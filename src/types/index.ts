export type Role = "ADMIN" | "PARENT";
export type Gender = "MALE" | "FEMALE";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parent {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  user?: User;
  students?: Student[];
}

export interface Student {
  id: string;
  parentId: string;
  fullName: string;
  avatar: string | null;
  birthDate: Date;
  gender: Gender;
  className: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  parent?: Parent;
  growthRecords?: GrowthRecord[];
  attendances?: Attendance[];
}

export interface GrowthRecord {
  id: string;
  studentId: string;
  date: Date;
  height: number;
  weight: number;
  healthNote: string | null;
  teacherComment: string | null;
  createdAt: Date;
  student?: Student;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  note: string | null;
  createdAt: Date;
  student?: Student;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetClass: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User;
}

export interface DashboardStats {
  totalStudents: number;
  totalParents: number;
  totalClasses: number;
  averageAttendanceRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}
