import { query } from '../database/client'; 
import { User, UserRegistrationRequest } from '../types/user';
import { CustomError } from '../types/error';
import { validateCitizenIdChecksum } from '../utils/validationUtils'; 

// Function สำหรับสร้างผู้ใช้ใหม่
export const createUser = async (userData: User): Promise<User> => {
  // ตรวจสอบ checksum เลขบัตรประชาชน
  if (!validateCitizenIdChecksum(userData.citizen_id)) {
    const error: CustomError = new Error('Invalid Citizen ID checksum.');
    error.statusCode = 400;
    throw error;
  }

  const {
    student_id,
    citizen_id,
    prefix,
    first_name,
    last_name,
    nickname,
    academic_year,
    faculty,
    password_hash,
    phone_number,
    parent_name,
    parent_phone_number,
    parent_relationship,
    role,
  } = userData;

  const result = await query(
    `INSERT INTO users (
      student_id, citizen_id, prefix, first_name, last_name, nickname,
      academic_year, faculty, password_hash, phone_number,
      parent_name, parent_phone_number, parent_relationship, role
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`, // RETURNING * เพื่อให้ได้ข้อมูลที่ insert กลับมา
    [
      student_id,
      citizen_id,
      prefix,
      first_name,
      last_name,
      nickname,
      academic_year,
      faculty,
      password_hash,
      phone_number,
      parent_name,
      parent_phone_number,
      parent_relationship,
      role,
    ]
  );
  return result.rows[0]; // คืนค่าผู้ใช้ที่สร้างขึ้นมา
};

// Function สำหรับค้นหาผู้ใช้ด้วย student_id และ citizen_id
export const findUserByStudentIdAndCitizenId = async (
  student_id: string,
  citizen_id: string
): Promise<User | undefined> => {
  const result = await query(
    `SELECT * FROM users WHERE student_id = $1 AND citizen_id = $2`,
    [student_id, citizen_id]
  );
  return result.rows[0];
};

// Function สำหรับค้นหาผู้ใช้ด้วย student_id (อาจมีหลายคนถ้า citizen_id ต่างกัน)
export const findUsersByStudentId = async (student_id: string): Promise<User[]> => {
  const result = await query(
    `SELECT * FROM users WHERE student_id = $1`,
    [student_id]
  );
  return result.rows;
};

// Function สำหรับค้นหาผู้ใช้ด้วย ID (ถ้าใช้ ID แทน Composite Key)
// export const findUserById = async (id: number): Promise<User | undefined> => {
//   const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
//   return result.rows[0];
// };