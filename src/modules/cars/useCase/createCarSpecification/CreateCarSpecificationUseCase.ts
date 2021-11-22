import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  carId: string;
  specificationsId: string[];
}

@injectable()
export class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ carId, specificationsId }: IRequest): Promise<Car> {
    const carExist = await this.carsRepository.findById(carId);

    if (!carExist) {
      throw new AppError('car does not exist');
    }

    const specifications = await this.specificationsRepository.findByIds(
      specificationsId
    );

    carExist.specifications = specifications;

    const car = await this.carsRepository.create(carExist);

    return carExist;
  }
}
