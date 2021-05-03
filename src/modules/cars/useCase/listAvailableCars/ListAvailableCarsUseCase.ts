import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { inject, injectable } from 'tsyringe';


interface IRequest{
  category_id?: string;
  brand?: string;
  name?: string;

}

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
    ) {}

  async execute({category_id,name,brand}:IRequest): Promise<Car[]> {
    const cars = await this.carsRepository.listAllAvailableCars(brand,category_id,name);

    return cars;
  }
}
