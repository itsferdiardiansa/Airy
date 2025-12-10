import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ApiResponse } from '@/utils/api-response';

export const userController = {
  async AllUsers(req: Request, res: Response) {
    const users = await UserService.findAll();
    return ApiResponse.success(res, users, 'Users retrieved successfully');
  },

  async FindUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UserService.findById(id);
    return ApiResponse.success(res, user, 'User details retrieved');
  },

  async UpdateUserById(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await UserService.update(id, data);
    return ApiResponse.success(res, updatedUser, 'User updated successfully');
  },

  async DeleteUserById(req: Request, res: Response) {
    const { id } = req.params;
    await UserService.delete(id);
    return ApiResponse.success(res, null, 'User deactivated successfully');
  },
};
