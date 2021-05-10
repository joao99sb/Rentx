import { ICreateSpecificationDTO } from '../DTOS/ICreateSpecificationDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

export interface ISpecificationsRepository {
  create({
    description,
    name,
  }: ICreateSpecificationDTO): Promise<Specification>;
  findByName(name: string): Promise<Specification | undefined>;
  list(): Promise<Specification[]>;
  findByIds(ids: string[]): Promise<Specification[]>;
}
