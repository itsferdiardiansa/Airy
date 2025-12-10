import prisma from '@/utils/prisma';
import createHttpError from 'http-errors';

export class UserService {
  static async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoPath: true,
          },
        },
      },
    });
  }

  static async findById(id: string | undefined) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });

    if (!user) throw createHttpError(404, 'User not found');
    return user;
  }

  static async update(id: string | undefined, data: any) {
    await this.findById(id);
    const { password, ...updateData } = data;
    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  static async delete(id: string | undefined) {
    await this.findById(id);
    return prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE', deletedAt: new Date() },
    });
  }
}
