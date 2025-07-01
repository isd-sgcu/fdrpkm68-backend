export type UserPrefix = 'นาย' | 'นางสาว' | 'ไม่ระบุ';
export type UserRole = 'student' | 'staff';

// Interface สำหรับข้อมูลผู้ใช้ทั้งหมด
export interface User {
  student_id: string;
  citizen_id: string;
  prefix: UserPrefix;
  first_name: string;
  last_name: string;
  nickname: string; 
  academic_year: string;
  faculty: string;
  password_hash: string; 
  phone_number: string;
  parent_name: string; 
  parent_phone_number: string; 
  parent_relationship: string; 
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

// Interface สำหรับข้อมูลที่รับเข้ามาตอน Register 
export interface UserRegistrationRequest {
  student_id: string;
  citizen_id: string;
  prefix: UserPrefix;
  first_name: string;
  last_name: string;
  nickname: string;
  academic_year: string;
  faculty: string;
  password: string; 
  phone_number: string;
  parent_name: string;
  parent_phone_number: string;
  parent_relationship: string;
}

// Interface UserPublic สำหรับข้อมูลที่ส่งกลับไปยัง Frontend
export interface UserPublic {
  student_id: string;
  citizen_id: string;
  prefix: UserPrefix;
  first_name: string;
  last_name: string;
  nickname: string;
  academic_year: string;
  faculty: string;
  phone_number: string;
  parent_name: string;
  parent_phone_number: string;
  parent_relationship: string;
  role: UserRole;
}