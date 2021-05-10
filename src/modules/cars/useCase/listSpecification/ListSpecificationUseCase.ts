import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { SpecificationsRepository } from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';
import { inject, injectable } from 'tsyringe';

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
