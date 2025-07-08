export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^(0\d{9})$/;
  return regex.test(phoneNumber) && phoneNumber.length === 10;
};
