import { DeepPartial } from "typeorm";
import { IUser } from "../entities/user-entity.interface";

export interface UserRepositoryInterface {
  findById(id: string): Promise<DeepPartial<IUser> | null>;
  findByUsername(username: string): Promise<DeepPartial<IUser> | null>;
  createUser(user: IUser): Promise<DeepPartial<IUser>>;
  deleteUser(id: string): Promise<void>;
}