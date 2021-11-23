import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
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
      licensePlate: 'test',
      dailyRate: 30,
      fineAmount: 20,
      categoryId: '23123',
    });

    const rental = await createRentalUsecase.execute({
      carId: car.id,
      userId: '12345',
      expectedReturnDate: dayAdd24H,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('startDate');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      carId: '1212',
      userId: '12345',
      expectedReturnDate: dayAdd24H,
    });

    await expect(
      createRentalUsecase.execute({
        carId: '122222',
        userId: '12345',
        expectedReturnDate: dayAdd24H,
      })
    ).rejects.toEqual(new AppError('there is a rental in progress for user!'));
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      carId: '7777',
      userId: '7777',
      expectedReturnDate: dayAdd24H,
    });

    await expect(
      createRentalUsecase.execute({
        carId: '7777',
        userId: '8888',
        expectedReturnDate: dayAdd24H,
      })
    ).rejects.toEqual(new AppError('car is unavailable'));
  });

  it('should not be able to create a new rental with invalide return date', async () => {
    await expect(
      createRentalUsecase.execute({
        carId: '77777',
        userId: '77777',
        expectedReturnDate: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalide return time'));
  });
});
