import z from 'zod';
import { authSchema } from './auth.schema';

export type SignupBody = z.infer<(typeof authSchema)['signup']>;
export type SigninBody = z.infer<(typeof authSchema)['signin']>;
export type Role = 'ADMIN' | 'USER' | 'MANAGER' | 'HR';
