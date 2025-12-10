import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { MultipartMiddleware } from '@/middlewares/multipart.middleware';
import { UploadMiddleware } from '@/middlewares/upload.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { employeesController } from '@/modules/v1/employees/employees.controller';
import { employeesSchema } from '@/modules/v1/employees/employees.schema';

const router = Router();

const uploadMiddleware = UploadMiddleware.memory({
  fieldName: 'photo',
  fileSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
});

router.use(AuthMiddleware.access);

router.get(
  '/',
  ValidationMiddleware.validate({ query: employeesSchema.employeeQuery }),
  employeesController.findAllEmployees
);

router.get(
  '/:id',
  ValidationMiddleware.validate({ params: employeesSchema.employeeParams }),
  employeesController.findEmployeeById
);

router.post(
  '/',
  uploadMiddleware.single('photo'),
  MultipartMiddleware.normalize(['address', 'metadata']),
  ValidationMiddleware.validate({ body: employeesSchema.createEmployee }),
  employeesController.createEmployees
);

router.patch(
  '/:id',
  uploadMiddleware.single('photo'),
  MultipartMiddleware.normalize(),
  ValidationMiddleware.validate({
    params: employeesSchema.employeeParams,
    body: employeesSchema.updateEmployee,
  }),
  employeesController.updateEmployeeById
);

router.delete(
  '/:id',
  AuthMiddleware.role('ADMIN'),
  ValidationMiddleware.validate({ params: employeesSchema.employeeParams }),
  employeesController.deleteEmployeeById
);

export default router;
