import { Router } from 'express';
import { AuthenticateUserController } from '@modules/accounts/useCase/authenticateUser/AuthenticateUserController';

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

authenticateRoutes.post('/session', authenticateUserController.hendle);

export { authenticateRoutes };
