import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { ICreateUserDTO } from '@modules/accounts/DTOs/ICreateUserDTO';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    password,
    email,
    driverLicense,
  }: ICreateUserDTO): Promise<void> {
    const userAlreadyExist = await this.usersRepository.findByEmail(email);

    if (userAlreadyExist) {
      throw new AppError('user already exist');
    }

    const passwordHash = await hash(password, 10);

    await this.usersRepository.create({
      name,
      password: passwordHash,
      email,
      driverLicense,
    });
  }
}
