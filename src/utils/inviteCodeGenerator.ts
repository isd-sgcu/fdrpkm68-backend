import { prisma } from "@/lib/prisma";

export class InviteCodeGenerator {
  private static readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private static readonly CODE_LENGTH = 6;
  private static readonly MAX_ATTEMPTS = 10;

  static async generate(): Promise<string> {
    let attempts = 0;

    while (attempts < this.MAX_ATTEMPTS) {
      const code = this.generateRandomCode();
      
      const exists = await this.checkCodeExists(code);
      if (!exists) {
        return code;
      }
      
      attempts++;
    }

    throw new Error(`Failed to generate unique invite code after ${this.MAX_ATTEMPTS} attempts`);
  }

  private static generateRandomCode(): string {
    return Array.from({ length: this.CODE_LENGTH }, () =>
      this.CHARACTERS.charAt(Math.floor(Math.random() * this.CHARACTERS.length))
    ).join('');
  }

  private static async checkCodeExists(code: string): Promise<boolean> {
    try {
      const existingGroup = await prisma.group.findUnique({
        where: { inviteCode: code.toUpperCase() },
        select: { id: true }
      });

      return existingGroup !== null;
    } catch (error) {
      console.error('Error checking invite code existence:', error);
      throw new Error('Failed to validate invite code uniqueness');
    }
  }

  static isValidFormat(code: string): boolean {
    if (!code || code.length !== this.CODE_LENGTH) {
      return false;
    }

    const upperCode = code.toUpperCase();
    return /^[A-Z0-9]{6}$/.test(upperCode);
  }

  static normalize(code: string): string {
    return code.toUpperCase().trim();
  }
}