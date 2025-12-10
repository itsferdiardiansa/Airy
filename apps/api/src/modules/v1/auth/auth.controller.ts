import { Request, Response } from 'express';
import { setCookie, clearCookie } from '@/utils/cookie';
import { AuthService } from './auth.service';
import { SigninBody, SignupBody } from './auth.types';
import { ApiResponse } from '@/utils/api-response';

export const authController = {
  async signup(req: Request, res: Response) {
    const body = req.body as SignupBody;
    const result = await AuthService.signup(body);

    setCookie(res, 'accessToken', result.accessToken);
    setCookie(res, 'refreshToken', result.refreshToken);

    return ApiResponse.created(res, result, 'Registration successful');
  },

  async signin(req: Request, res: Response) {
    const body = req.body as SigninBody;
    const result = await AuthService.signin(body);

    setCookie(res, 'accessToken', result.accessToken);
    setCookie(res, 'refreshToken', result.refreshToken);

    return ApiResponse.success(res, result, 'Login successful');
  },

  async signout(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (userId) {
      await AuthService.signout(userId);
    }

    clearCookie(res, 'accessToken');
    clearCookie(res, 'refreshToken');

    return ApiResponse.success(res, null, 'Signed out successfully');
  },

  async refreshToken(req: Request, res: Response) {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await AuthService.refreshToken(token);

    setCookie(res, 'accessToken', result.accessToken);
    setCookie(res, 'refreshToken', result.refreshToken);

    return ApiResponse.success(res, result, 'Token refreshed');
  },

  async signupAdmin(req: Request, res: Response) {
    const body = req.body as SignupBody;
    const result = await AuthService.signup({ ...body, role: 'ADMIN' });
    return ApiResponse.created(res, result, 'Admin registered');
  },

  async signinAdmin(req: Request, res: Response) {
    return authController.signin(req, res);
  },
};
