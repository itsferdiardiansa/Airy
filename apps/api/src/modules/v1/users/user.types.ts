import z from 'zod';
import { usersSchema } from './user.schema';

export type UserUpdate = z.infer<typeof usersSchema.userUpdateSchema>;
export type UserParamsId = z.infer<typeof usersSchema.userParamsId>;
