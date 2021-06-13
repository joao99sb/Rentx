import { ICreateUserDTO } from '@modules/accounts/DTOs/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositorytInMemory';

import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '001122',
      email: 'user@test.com',
      password: '123456',
      name: 'User Test',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate an nonexistent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: '112344',
      })
    ).rejects.toEqual(new AppError('email or password incorrect'));
  });

  it('should not be able to authenticate  with incorrect password', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000111',
      email: 'user1@test.com',
      password: '1234',
      name: 'user test',
    };
    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'password incorrect',
      })
    ).rejects.toEqual(new AppError('email or password incorrect'));
  });
});
