import prisma from '../lib/prisma.js';
import { userProfileSelect, userSelect } from '../selects/user.select.js';

class UserService {
  async getUser({ userData }) {
    return prisma.user.findMany({
      select: userSelect,
    });
  }
  async getProfile({ userId }) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: userProfileSelect,
    });
  }
  async updateProfile({ userId, data }) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: data,
      select: userProfileSelect,
    });
  }
}

export const userService = new UserService();
