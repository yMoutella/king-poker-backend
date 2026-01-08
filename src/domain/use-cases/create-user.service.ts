import { Injectable } from '@nestjs/common';
import { UserRepositoryOrm } from 'src/infrastructure/repository/user-repository-orm';
import * as bcrypt from 'bcrypt';
import { UserDuplicatedException } from '../exceptions/user-duplicated-exception';

interface CreateUserInterface{
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
}

@Injectable()
export class CreateUserService {

  constructor(
    private readonly userRepository: UserRepositoryOrm
  ){}

  async execute(data: CreateUserInterface ){
    const passwordHash: string =  await bcrypt.hash(data.password, 6);
    const user = await this.userRepository.createUser({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: passwordHash,
      isActive: true
    });

    if (!user) {
      throw new UserDuplicatedException()
    }

    return {
      ...user,
      password:undefined
    };
  }

}
