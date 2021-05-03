import { ICreateSpecificationDTO } from '../DTOS/ICreateSpecificationDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

export interface ISpecificationRepository {
  create({ description, name }: ICreateSpecificationDTO): Promise<void>;
  findByName(name: string): Promise<Specification | undefined>;
  list(): Promise<Specification[]>;
}
