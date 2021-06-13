import { ICreateCarDTO } from '@modules/cars/DTOS/ICreateCarDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { getRepository, Repository } from 'typeorm';

import { Car } from '../entities/Car';

export class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const carExist = await this.findByLicensePlate(license_plate);
    if (carExist && specifications) {
      carExist.specifications = specifications;

      const carUpdated = await this.repository.save(carExist);
      console.log(carUpdated);
      return carUpdated;
    }
    const car = this.repository.create({
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      specifications,
    });
    await this.repository.save(car);
    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    const car = await this.repository.findOne({
      license_plate,
    });

    return car;
  }

  async listAllAvailableCars(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const carsQuery = await this.repository
      .createQueryBuilder('c')
      .where('available = :available', { available: true });

    if (brand) {
      carsQuery.andWhere('c.brand = :brand', { brand });
    }
    if (name) {
      carsQuery.andWhere('c.name = :name', { name });
    }
    if (category_id) {
      carsQuery.andWhere('c.category_id = :category_id', { category_id });
    }

    const cars = await carsQuery.getMany();
    return cars;
  }

  async findById(id: string): Promise<Car | undefined> {
    const car = await this.repository.findOne(id);
    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where('id = :id')
      .setParameters({ id })
      .execute();
  }
}
