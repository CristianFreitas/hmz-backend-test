import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/handleErrors';
import authService from './authService';

const prisma = new PrismaClient();

type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface PaginatedUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserResponse[];
}

export class UserService {
  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || undefined
    };
  }

  async getUsers(page: number = 1, perPage: number = 5): Promise<PaginatedUsersResponse> {
    if (page < 1) page = 1;
    if (perPage < 1) perPage = 5;

    const skip = (page - 1) * perPage;
    const totalUsers = await prisma.user.count();
    const totalPages = Math.ceil(totalUsers / perPage);

    const users = await prisma.user.findMany({
      skip,
      take: perPage,
      orderBy: { id: 'asc' }
    });

    const data = users.map(this.toUserResponse);

    return {
      page,
      per_page: perPage,
      total: totalUsers,
      total_pages: totalPages,
      data
    };
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.toUserResponse(user);
  }

  async createUser(userData: UserData): Promise<UserResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await authService.hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });

    return this.toUserResponse(user);
  }

  async updateUser(id: number, userData: Partial<UserData>): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    let updatedData = { ...userData };
    if (userData.password) {
      updatedData.password = await authService.hashPassword(userData.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData
    });

    return this.toUserResponse(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id }
    });
  }
}

export default new UserService();
