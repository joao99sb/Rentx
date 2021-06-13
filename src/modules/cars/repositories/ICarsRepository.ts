import { ICreateCarDTO } from '../DTOS/ICreateCarDTO';
import { Car } from '../infra/typeorm/entities/Car';

export interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  listAllAvailableCars(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]>;
  findById(id: string): Promise<Car | undefined>;
  updateAvailable(id: string, available: boolean): Promise<void>;
}
