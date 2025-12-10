import prisma from '@/utils/prisma';
import {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeQuery,
} from './employees.type';
import createHttpError from 'http-errors';

export class EmployeesService {
  static async findAll(query: EmployeeQuery) {
    const { name, departmentId, status, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.OR = [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
      ];
    }
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;

    const [total, data] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          department: { select: { id: true, name: true } },
          jobTitle: { select: { id: true, title: true } },
          manager: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        jobTitle: true,
        manager: true,
        subordinates: true,
        user: { select: { id: true, email: true, username: true } },
      },
    });

    if (!employee) {
      throw createHttpError(404, 'Employee not found');
    }

    return employee;
  }

  static async create(
    data: CreateEmployeeInput & { createdBy?: string; photoPath?: string }
  ) {
    const existing = await prisma.employee.findFirst({
      where: { email: data.email },
    });
    if (existing)
      throw createHttpError(409, 'Employee with this email already exists');

    return prisma.employee.create({
      data: {
        ...data,
      },
    });
  }

  static async update(id: string, data: UpdateEmployeeInput) {
    await this.findById(id);

    return prisma.employee.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    await this.findById(id);
    return prisma.employee.delete({ where: { id } });
  }
}
