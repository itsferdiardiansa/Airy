import z from 'zod';

export const employeesSchema = {
  createEmployee: z.object({
    email: z.string().email().min(5).max(150),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    personalEmail: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().datetime().optional(),
    departmentId: z.string().cuid().optional(),
    jobTitleId: z.string().cuid().optional(),
    managerId: z.string().cuid().optional(),
    status: z
      .enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION'])
      .default('ACTIVE'),
  }),

  updateEmployee: z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    personalEmail: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    departmentId: z.string().cuid().optional(),
    jobTitleId: z.string().cuid().optional(),
    managerId: z.string().cuid().optional(),
    photoPath: z.string().optional(),
    status: z
      .enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION'])
      .optional(),
  }),

  employeeParams: z.object({
    id: z.string().cuid(),
  }),

  employeeQuery: z.object({
    name: z.string().optional(),
    departmentId: z.string().optional(),
    status: z
      .enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION'])
      .optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
};
