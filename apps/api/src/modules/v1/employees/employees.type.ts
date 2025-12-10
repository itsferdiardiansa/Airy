import z from 'zod';
import { employeesSchema } from './employees.schema';

export type CreateEmployeeInput = z.infer<
  (typeof employeesSchema)['createEmployee']
>;
export type UpdateEmployeeInput = z.infer<
  (typeof employeesSchema)['updateEmployee']
>;
export type EmployeeParams = z.infer<
  (typeof employeesSchema)['employeeParams']
>;
export type EmployeeQuery = z.infer<(typeof employeesSchema)['employeeQuery']>;
