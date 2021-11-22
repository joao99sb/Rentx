import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  userId: string;
}

@injectable()
export class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, userId }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental does not exists!');
    }

    const car = await this.carsRepository.findById(rental.carId);
    const minimunDaily = 1;

    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compareInDays(rental.startDate, dateNow);

    if (daily <= 0) {
      daily = minimunDaily;
    }

    const delay = this.dateProvider.compareInDays(
      rental.expectedReturnDate,
      dateNow
    );

    let total = 0;

    if (!car) {
      throw new AppError('Car does not exist');
    }
    if (delay > 0) {
      const calculateFine = delay * car.fineAmount;

      total = calculateFine;
    }

    total += daily * car.dailyRate;

    rental.endDate = this.dateProvider.dateNow();
    rental.total = total;
    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}
