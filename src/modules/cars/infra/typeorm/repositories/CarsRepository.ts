import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/DTOS/ICreateCarDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

export class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    brand,
    categoryId,
    dailyRate,
    description,
    fineAmount,
    licensePlate,
    name,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const carExist = await this.findByLicensePlate(licensePlate);
    if (carExist && specifications) {
      carExist.specifications = specifications;

      const carUpdated = await this.repository.save(carExist);
      return carUpdated;
    }
    const car = this.repository.create({
      brand,
      categoryId,
      dailyRate,
      description,
      fineAmount,
      licensePlate,
      name,
      specifications,
    });
    await this.repository.save(car);
    return car;
  }

  async findByLicensePlate(licensePlate: string): Promise<Car> {
    const car = await this.repository.findOne({
      licensePlate,
    });

    return car;
  }

  async listAllAvailableCars(
    brand?: string,
    categoryId?: string,
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
    if (categoryId) {
      carsQuery.andWhere('c.category_id = :category_id', { categoryId });
    }

    const cars = await carsQuery.getMany();
    return cars;
  }

  async findById(id: string): Promise<Car> {
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
