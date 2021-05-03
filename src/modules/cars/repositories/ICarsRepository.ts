import { ICreateCarDTO } from '../DTOS/ICreateCarDTO';
import { Car } from '../infra/typeorm/entities/Car';

export interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  listAllAvailableCars(): Promise<Car[]>;
}
