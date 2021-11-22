import { Router } from 'express';

import { AuthenticateUserController } from '@modules/accounts/useCase/authenticateUser/AuthenticateUserController';
import { RefreshTokenController } from '@modules/accounts/useCase/refreshToken/RefreshTokenController';

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post('/session', authenticateUserController.handle);
authenticateRoutes.post('/refresh_token', refreshTokenController.handle);

export { authenticateRoutes };
