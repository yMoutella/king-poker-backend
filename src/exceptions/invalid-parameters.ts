export class InvalidParametersException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidParametersException';
  }
}
