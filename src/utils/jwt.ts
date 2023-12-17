import { UserRole } from '@/domain/entities/enums';
import jwt from 'jsonwebtoken';

type Payload = {
  id: string;
  role: UserRole;
};

export const validateToken = (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload as Payload;
  } catch (error) {
    return null;
  }
};

export const signToken = (payload: Payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || '');
  return token;
};
