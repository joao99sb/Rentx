import { ICreateUserDTO } from '../../DTOs/ICreateUserDTO';
import { User } from '../../infra/typeorm/entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    name,
    password,
    driver_license,
    email,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      name,
      password,
      driver_license,
      email,
    });

    this.users.push(user);
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
}
