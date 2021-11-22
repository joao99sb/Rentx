import { inject, injectable } from 'tsyringe';

import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { SpecificationsRepository } from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';

@injectable()
export class SpecificationUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationRepositoy: SpecificationsRepository
  ) {}

  async execute(): Promise<Specification[]> {
    const all = await this.specificationRepositoy.list();
    return all;
  }
}
