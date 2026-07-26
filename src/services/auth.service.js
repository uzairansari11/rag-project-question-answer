import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { generateAccessToken } from '../utils/jwt.js';

const DEFAULT_COLLECTION = {
  title: 'My Collection',
  description: 'Default collection',
};

class AuthService {
  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
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
        collections: {
          create: {
            ...DEFAULT_COLLECTION,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        collections: {
          select: {
            title: true,
          },
        },
      },
    });
    return user;
  }

  async profile(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        firstName: true,
        email: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        id: true,
      },
    });
    return user;
  }
}

export default new AuthService();
