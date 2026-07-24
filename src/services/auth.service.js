import prisma from '../lib/prisma.js';
import bcrypt from "bcrypt"
class AuthService {
  async register(payload) {
    const { firstName, lastName, email, password } = payload;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ApiError(409, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });
    return user;
  }
}

export default new AuthService();
