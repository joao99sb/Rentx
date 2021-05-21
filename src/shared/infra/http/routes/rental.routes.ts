import { CreateRentalController } from '@modules/rentals/useCase/createRental/CreateRentalController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const rentalsRoutes = Router();

const createRentalController = new CreateRentalController();

rentalsRoutes.post('/', ensureAuthenticated, createRentalController.handle);

export { rentalsRoutes };
