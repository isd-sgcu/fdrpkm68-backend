export class UUIDValidator {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  static isValid(uuid: string): boolean {
    if (!uuid || typeof uuid !== 'string') {
      return false;
    }
    return this.UUID_REGEX.test(uuid);
  }

  static validate(uuid: string, fieldName: string = 'ID'): void {
    if (!this.isValid(uuid)) {
      throw new Error(`Invalid ${fieldName} format. Expected UUID.`);
    }
  }
}