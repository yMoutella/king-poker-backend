import { IsEmail, IsNotEmpty, Length } from 'class-validator';


export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsNotEmpty()
  userName: string
  @IsNotEmpty()
  @Length(6, 20)
  password: string
  @IsNotEmpty()
  firstName: string
  @IsNotEmpty()
  lastName: string

}
