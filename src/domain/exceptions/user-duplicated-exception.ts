export class UserDuplicatedException extends Error {
  constructor() {
    super('User already exists');
  }
}