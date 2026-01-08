import { IUser } from "src/domain/entities/user-entity.interface";
import { BeforeInsert, Column, PrimaryColumn } from "typeorm";
import { uuidv7 } from "uuidv7";

export class UserEntityOrm implements IUser{

  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @Column({name: 'username', type: 'varchar', unique: true })
  username: string;

  @Column({name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({name: 'password_hash', type: 'varchar' })
  passwordHash: string;

  @Column({name: 'is_active', type: 'boolean' })
  isActive: boolean;
}