import { AuthenticateUserController } from '@modules/accounts/useCase/authenticateUser/AuthenticateUserController';
import { Router } from 'express';

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

authenticateRoutes.post('/session', authenticateUserController.hendle);

export { authenticateRoutes };
