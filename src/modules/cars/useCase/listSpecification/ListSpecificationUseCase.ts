import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { SpecificationRepository } from '@modules/cars/infra/typeorm/repositories/SpecificationRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SpecificationUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepositoy: SpecificationRepository,
  ) {}

  async execute(): Promise<Specification[]> {
    const all = await this.specificationRepositoy.list();
    return all;
  }
}
