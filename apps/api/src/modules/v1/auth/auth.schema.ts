import z from 'zod';

export const authSchema = {
  signup: z.object({
    email: z.string().email().min(5).max(150),
    username: z.string().min(3).max(50),
    name: z.string().min(2).max(150),
    password: z.string().min(8).max(100),
    role: z.enum(['ADMIN', 'USER', 'MANAGER', 'HR']).optional(),
  }),
  signin: z.object({
    email_or_username: z.string().min(3),
    password: z.string().min(1),
  }),
};
