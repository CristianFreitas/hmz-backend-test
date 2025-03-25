import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/handleErrors';

const prisma = new PrismaClient();

export interface LoginData {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export class AuthService {
  async login(data: LoginData): Promise<TokenResponse> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    
    const token = jwt.sign(
      { id: user.id }, 
      jwtSecret, 
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
      } as jwt.SignOptions
    );

    return { token };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}

export default new AuthService();
