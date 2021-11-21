import { Router } from 'express';

import { CreateSpecificationController } from '../../../../modules/cars/useCase/createSpecification/CreateSpecificationController';
import { ListSpecificationController } from '../../../../modules/cars/useCase/listSpecification/ListSpecificationController';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificationController = new ListSpecificationController();

specificationsRoutes.use(ensureAuthenticated);
specificationsRoutes.post('/', createSpecificationController.handle);

specificationsRoutes.get('/', listSpecificationController.handle);

export { specificationsRoutes };
