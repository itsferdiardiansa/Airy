import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { authController } from '@/modules/v1/auth/auth.controller';
import { authSchema } from '@/modules/v1/auth/auth.schema';

const router = Router();

router.post(
  '/sign_up',
  ValidationMiddleware.validate({ body: authSchema.signup }),
  authController.signup
);

router.post(
  '/sign_in',
  ValidationMiddleware.validate({ body: authSchema.signin }),
  authController.signin
);

router.post(
  '/sign_up/admin',
  ValidationMiddleware.validate({ body: authSchema.signup }),
  authController.signupAdmin
);

router.post(
  '/sign_in/admin',
  ValidationMiddleware.validate({ body: authSchema.signin }),
  authController.signinAdmin
);

router.get('/refresh', AuthMiddleware.refresh, authController.refreshToken);

router.delete('/sign_out', AuthMiddleware.access, authController.signout);

export default router;
