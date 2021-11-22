import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
  dailyRate: number;
  licensePlate: string;
  fineAmount: number;
  brand: string;
  categoryId: string;
}

@injectable()
export class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    brand,
    name,
    description,
    dailyRate,
    fineAmount,
    licensePlate,
    categoryId,
  }: IRequest): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      licensePlate
    );

    if (carAlreadyExists) {
      throw new AppError('Car already exists');
    }
    const car = await this.carsRepository.create({
      brand,
      name,
      description,
      dailyRate,
      fineAmount,
      licensePlate,
      categoryId,
    });

    return car;
  }
}
