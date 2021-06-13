import { ICreateCarDTO } from '@modules/cars/DTOS/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

export class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
    });

    this.cars.push(car);
    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async listAllAvailableCars(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const cars = this.cars.filter(car => {
      if (
        car.available === true ||
        (brand && car.brand === brand) ||
        (category_id && car.category_id === category_id) ||
        (name && car.name)
      ) {
        return car;
      }
      return null;
    });
    return cars;
  }

  async findById(id: string): Promise<Car | undefined> {
    return this.cars.find(car => car.id === id);
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex(car => car.id === id);
    this.cars[findIndex].available = available;
  }
}
