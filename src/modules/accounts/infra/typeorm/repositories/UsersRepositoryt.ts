import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '../../../DTOs/ICreateUserDTO';
import { IUsersRepository } from '../../../repositories/IUsersRepository';
import { User } from '../entities/User';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    id,
    avatar,
    email,
    driverLicense,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      driverLicense,
      password,
      avatar,
      id,
    });

    await this.repository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }
}
