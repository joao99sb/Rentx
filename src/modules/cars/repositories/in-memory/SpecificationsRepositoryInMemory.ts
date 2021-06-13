import { ICreateSpecificationDTO } from '@modules/cars/DTOS/ICreateSpecificationDTO';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';

import { ISpecificationsRepository } from '../ISpecificationsRepository';

export class SpecificationsRepositoryInMemory
  implements ISpecificationsRepository {
  private specifications: Specification[] = [];

  async create({
    description,
    name,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();
    Object.assign(specification, { description, name });

    this.specifications.push(specification);
    return specification;
  }

  async findByName(name: string): Promise<Specification | undefined> {
    return this.specifications.find(
      specification => specification.name === name
    );
  }

  async list(): Promise<Specification[]> {
    return this.specifications;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const allSpecifications = this.specifications.filter(specification =>
      ids.includes(specification.id)
    );
    return allSpecifications;
  }
}
