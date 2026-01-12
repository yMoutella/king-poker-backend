import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {

      const {userName, email} = createUserDto;
      const doesUserExists = await this.findOne(userName, email);

      if (doesUserExists) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = bcrypt.hashSync(createUserDto.password, 6);

      const user = await this.prisma.user
        .create({
          data: {
            email: createUserDto.email,
            userName: createUserDto.userName,
            passwordHash: hashedPassword,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
          },
        })
        .catch((error) => {
          console.log(error)
        })
      return {
        ...user,
        passwordHash: undefined
      };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(userName: string, email: string) {

    const user = await this.prisma.user.findFirst({
      where: {
      OR: [
        { userName: userName },
        { email: email }
      ]
      },
    });

    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
