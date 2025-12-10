import { Request, Response } from 'express';
import { EmployeesService } from './employees.service';
import {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeQuery,
  EmployeeParams,
} from './employees.type';
import { verifyAccessToken } from '@/utils/jwt';
import { StorageService } from '@/services/storage.service';
import { ApiResponse } from '@/utils/api-response';

export const employeesController = {
  async findAllEmployees(req: Request, res: Response) {
    const query = req.query as unknown as EmployeeQuery;
    const result = await EmployeesService.findAll(query);
    return ApiResponse.success(
      res,
      result.data,
      'Employees retrieved successfully',
      result.meta
    );
  },

  async createEmployees(req: Request, res: Response) {
    const body = req.body as CreateEmployeeInput;
    const { sub } = verifyAccessToken(req.cookies.accessToken);

    let photoUrl: string | undefined;

    if (req.file) {
      photoUrl = await StorageService.upload(req.file, 'employees');
    }

    const employee = await EmployeesService.create({
      ...body,
      photoPath: photoUrl,
    });

    return ApiResponse.created(res, employee, 'Employee created successfully');
  },

  async findEmployeeById(req: Request, res: Response) {
    const { id } = req.params as EmployeeParams;
    const employee = await EmployeesService.findById(id);
    return ApiResponse.success(res, employee, 'Employee details retrieved');
  },

  async findEmployeeByName(req: Request, res: Response) {
    const { name } = req.query as unknown as EmployeeQuery;

    const result = await EmployeesService.findAll({
      name,
      page: 1,
      limit: 100,
    });

    return ApiResponse.success(res, result.data, 'Employees found by name');
  },

  async updateEmployeeById(req: Request, res: Response) {
    const { id } = req.params as EmployeeParams;
    const body = req.body as UpdateEmployeeInput;

    const existing = await EmployeesService.findById(id);

    if (req.file) {
      if (existing.photoPath) {
        await StorageService.delete(existing.photoPath);
      }
      const newUrl = await StorageService.upload(req.file, 'employees');
      body.photoPath = newUrl;
    }

    const updated = await EmployeesService.update(id, body);
    return ApiResponse.success(res, updated, 'Employee updated successfully');
  },

  async deleteEmployeeById(req: Request, res: Response) {
    const { id } = req.params as EmployeeParams;
    const existing = await EmployeesService.findById(id);

    if (existing.photoPath) {
      await StorageService.delete(existing.photoPath);
    }

    await EmployeesService.delete(id);
    return ApiResponse.success(res, null, 'Employee deleted successfully');
  },
};
