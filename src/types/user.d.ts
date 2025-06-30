// src/types/user.d.ts

// Enum สำหรับคำนำหน้าและ Role
export type UserPrefix = 'นาย' | 'นางสาว' | 'ไม่ระบุ';
export type UserRole = 'student' | 'staff';

// Interface สำหรับข้อมูลผู้ใช้ทั้งหมด (รวมข้อมูล sensitive เช่น password_hash)
export interface User {
  student_id: string;
  citizen_id: string;
  prefix: UserPrefix;
  first_name: string;
  last_name: string;
  nickname?: string; // Optional
  academic_year: string;
  faculty: string;
  password_hash: string; // เก็บ password ที่ Hash แล้ว
  phone_number: string;
  parent_name?: string; // Optional
  parent_phone_number?: string; // Optional
  parent_relationship?: string; // Optional
  role: UserRole;
  created_at?: Date; // Optional, set by DB
  updated_at?: Date; // Optional, set by DB
  // health info, house info จะเพิ่มทีหลังใน Phase 2
}

// Interface สำหรับข้อมูลที่รับเข้ามาตอน Register (ไม่มี password_hash)
export interface UserRegistrationRequest {
  student_id: string;
  citizen_id: string;
  prefix: UserPrefix;
  first_name: string;
  last_name: string;
  nickname?: string;
  academic_year: string;
  faculty: string;
  password: string; // เป็น plaintext password
  phone_number: string;
  parent_name?: string;
  parent_phone_number?: string;
  parent_relationship?: string;
  // role?: UserRole; // ถ้า Frontend สามารถระบุ role ได้
}

// Interface สำหรับข้อมูลผู้ใช้ที่จะส่งกลับไปให้ Frontend (ไม่มี sensitive data)
export interface UserPublic {
  student_id: string;
  citizen_id: string;
  prefix: UserPrefix;
  first_name: string;
  last_name: string;
  nickname?: string;
  academic_year: string;
  faculty: string;
  phone_number: string;
  parent_name?: string;
  parent_phone_number?: string;
  parent_relationship?: string;
  role: UserRole;
}