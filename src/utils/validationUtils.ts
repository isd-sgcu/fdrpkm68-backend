// src/utils/validationUtils.ts

/**
 * ตรวจสอบ Checksum ของเลขบัตรประชาชนไทย
 * @param citizenId เลขบัตรประชาชน 13 หลัก
 * @returns true ถ้า Checksum ถูกต้อง, false ถ้าไม่ถูกต้อง
 */
export const validateCitizenIdChecksum = (citizenId: string): boolean => {
  if (!citizenId || citizenId.length !== 13 || !/^\d{13}$/.test(citizenId)) {
    return false; // ไม่ใช่ 13 หลัก หรือมีตัวอักษรอื่นที่ไม่ใช่ตัวเลข
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(citizenId.charAt(i)) * (13 - i);
  }
  const lastDigit = parseInt(citizenId.charAt(12));
  const checksum = (11 - (sum % 11)) % 10;

  return checksum === lastDigit;
};

// สามารถเพิ่ม validation อื่นๆ ได้ที่นี่
// เช่น validate email, phone number format