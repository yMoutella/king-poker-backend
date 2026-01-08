import { DeepPartial, Repository } from "typeorm";
import { UserEntityOrm } from "../entity/user-entity-orm";
import { IUser } from "src/domain/entities/user-entity.interface";
import { UserRepositoryInterface } from "src/domain/repositories/user-repository.interface";

export class UserRepositoryOrm extends Repository<UserEntityOrm> implements UserRepositoryInterface {
  async createUser(user: IUser): Promise<DeepPartial<IUser>> {
    return this.save(user)
  }
  async findById(id: string): Promise<DeepPartial<IUser> | null> {
    return this.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<DeepPartial<IUser> | null> {
    return this.findOne({ where: { username } });
  } 

  async deleteUser(id: string): Promise<void> {
    await this.delete(id);
  } 
}