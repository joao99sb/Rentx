import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositorytInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvader';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailsUseCase: SendForgotPasswordMailUseCase;
let userRepositoryInMemory: UsersRepositoryInMemory;
let DateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;
describe('Send Forgot Mais', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UsersRepositoryInMemory();
    DateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailsUseCase = new SendForgotPasswordMailUseCase(
      userRepositoryInMemory,
      usersTokensRepositoryInMemory,
      DateProvider,
      mailProvider
    );
  });

  it('Should be able to send a fotgot password mail to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    await userRepositoryInMemory.create({
      driverLicense: '357363',
      email: 'ottowuf@talitob.kz',
      name: 'Olive Delgado',
      password: '1234',
    });

    await sendForgotPasswordMailsUseCase.execute('ottowuf@talitob.kz');

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailsUseCase.execute('ottowuf@talitob.kz')
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('Should be able to create an users token', async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, 'create');

    await userRepositoryInMemory.create({
      driverLicense: '958055',
      email: 'ejsu@codaz.mu',
      name: 'Hattie Pierce',
      password: '1234',
    });

    await sendForgotPasswordMailsUseCase.execute('ejsu@codaz.mu');
    expect(generateTokenMail).toBeCalled();
  });
});
