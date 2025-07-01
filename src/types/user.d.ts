import { PrefixType, FacultyId ,RoleType , EventType ,CheckinStatusType, GroupRoleType} from "./enum";

// Interface สำหรับข้อมูลผู้ใช้ทั้งหมด
export interface User {
  student_id: string;
  citizen_id: string;
  prefix: PrefixType;
  first_name: string;
  last_name: string;
  nickname: string; 
  academic_year: string;
  faculty: FacultyId;
  password_hash: string; 
  phone_number: string;
  parent_name: string; 
  parent_phone_number: string; 
  parent_relationship: string; 
  food_allergy?: string; 
  drug_allergy?: string; 
  illness?: string;
  avatar_id: number;
  role: RoleType;
  created_at: Date;
  updated_at: Date;
  group_role: GroupRoleType; // rpkm group
  group_id: string; // rpkm group
}

// Interface สำหรับข้อมูลที่รับเข้ามาตอน Register 
export interface UserRegistrationRequest {
  student_id: string;
  citizen_id: string;
  prefix: PrefixType;
  first_name: string;
  last_name: string;
  nickname: string;
  academic_year: string;
  faculty: FacultyId;
  password: string; 
  phone_number: string;
  parent_name: string;
  parent_phone_number: string;
  parent_relationship: string;
  food_allergy?: string; 
  drug_allergy?: string; 
  illness?: string; 
  avatar_id: number; 
}

// Interface UserPublic สำหรับข้อมูลที่ส่งกลับไปยัง Frontend
export interface UserPublic {
  student_id: string;
  citizen_id: string;
  prefix: PrefixType;
  first_name: string;
  last_name: string;
  nickname: string;
  academic_year: string;
  faculty: FacultyId;
  phone_number: string;
  parent_name: string;
  parent_phone_number: string;
  parent_relationship: string;
  food_allergy?: string;
  drug_allergy?: string;
  illness?: string;
  avatar_id: number;
  role: RoleType;
  group_role: GroupRoleType;
  group_id: string;
}