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

export const passwordStrengthValidator = (password: string): boolean => {
  if (!password || password.length < 8) {
    return false; 
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers;
}