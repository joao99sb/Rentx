import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  userId: string;
  carId: string;
  expectedReturnDate: Date;
}

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    carId,
    expectedReturnDate,
    userId,
  }: IRequest): Promise<Rental> {
    const minimunHour = 24;

    const carUnAvailable = await this.rentalsRepository.findOpenRentalByCar(
      carId
    );

    if (carUnAvailable) throw new AppError('car is unavailable');

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
      userId
    );

    if (rentalOpenToUser) {
      throw new AppError('there is a rental in progress for user!');
    }
    const dateNow = this.dateProvider.dateNow();

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expectedReturnDate
    );

    if (compare < minimunHour) {
      throw new AppError('Invalide return time');
    }

    const rental = await this.rentalsRepository.create({
      userId,
      carId,
      expectedReturnDate,
    });

    await this.carsRepository.updateAvailable(carId, false);

    return rental;
  }
}
