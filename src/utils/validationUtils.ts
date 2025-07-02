import { EventType } from "../types/enum";

export const validateCitizenIdChecksum = (citizenId: string): boolean => {
  if (!citizenId || citizenId.length !== 13 || !/^\d{13}$/.test(citizenId)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(citizenId.charAt(i)) * (13 - i);
  }
  const lastDigit = parseInt(citizenId.charAt(12));
  const checksum = (11 - (sum % 11)) % 10;

  return checksum === lastDigit;
};

export const validateCheckinInput = (
  student_id: string,
  citizen_id: string,
  eventRequired: boolean,
  event?: string,
): string => {
  const validationError: string[] = [];

  if (!student_id || typeof student_id !== 'string')
    validationError.push('student_id: required');
  else if (student_id.length !== 10 || !/^\d{10}$/.test(citizen_id))
    validationError.push('student_id: invalid');

  if (!citizen_id || typeof citizen_id !== 'string')
    validationError.push('citizen_id: required');
  else if (citizen_id.length !== 13 || !/^\d{13}$/.test(citizen_id))
    validationError.push('citizen_id: invalid');

  if (eventRequired) {
    if (!event || typeof event !== 'string')
      validationError.push('event: required');
    else if (!Object.values(EventType).includes(event as EventType))
      validationError.push('event: invalid');
  }

  return validationError.join(' ');
}