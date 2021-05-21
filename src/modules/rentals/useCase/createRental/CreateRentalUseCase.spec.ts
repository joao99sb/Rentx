import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import dayjs from 'dayjs';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvader';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUsecase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('create Rental', () => {
  const dayAdd24H = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUsecase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUsecase.execute({
      car_id: '1212',
      user_id: '12345',
      expected_return_date: dayAdd24H,
    });

    console.log(rental);

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    expect(async () => {
      await createRentalUsecase.execute({
        car_id: '123144',
        user_id: '12345',
        expected_return_date: dayAdd24H,
      });
      await createRentalUsecase.execute({
        car_id: '122222',
        user_id: '12345',
        expected_return_date: dayAdd24H,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    expect(async () => {
      await createRentalUsecase.execute({
        car_id: '7777',
        user_id: '7777',
        expected_return_date: dayAdd24H,
      });
      await createRentalUsecase.execute({
        car_id: '7777',
        user_id: '8888',
        expected_return_date: dayAdd24H,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with invalide return date', async () => {
    expect(async () => {
      await createRentalUsecase.execute({
        car_id: '77777',
        user_id: '77777',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
