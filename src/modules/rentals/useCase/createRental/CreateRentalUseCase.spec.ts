import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import dayjs from 'dayjs';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvader';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUsecase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('create Rental', () => {
  const dayAdd24H = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    createRentalUsecase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'test',
      brand: 'test',
      description: 'car test',
      license_plate: 'test',
      daily_rate: 30,
      fine_amount: 20,
      category_id: '23123',
    });

    const rental = await createRentalUsecase.execute({
      car_id: car.id,
      user_id: '12345',
      expected_return_date: dayAdd24H,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: '1212',
      user_id: '12345',
      expected_return_date: dayAdd24H,
    });

    await expect(
      createRentalUsecase.execute({
        car_id: '122222',
        user_id: '12345',
        expected_return_date: dayAdd24H,
      })
    ).rejects.toEqual(new AppError('there is a rental in progress for user!'));
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: '7777',
      user_id: '7777',
      expected_return_date: dayAdd24H,
    });

    await expect(
      createRentalUsecase.execute({
        car_id: '7777',
        user_id: '8888',
        expected_return_date: dayAdd24H,
      })
    ).rejects.toEqual(new AppError('car is unavailable'));
  });

  it('should not be able to create a new rental with invalide return date', async () => {
    await expect(
      createRentalUsecase.execute({
        car_id: '77777',
        user_id: '77777',
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalide return time'));
  });
});
