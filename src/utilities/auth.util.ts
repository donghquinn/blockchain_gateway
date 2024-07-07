import jwt from 'jsonwebtoken';
import { JwtModel } from 'types/auth.type';

export const createToken = (userId: string, userEmail: string, isManager: number, userStatus: number): string => {
  const tokenModel: JwtModel = {
    user_id: userId,
    user_email: userEmail,
    is_manager: isManager,
    user_status: userStatus,
  };

  const jwtKey = process.env.JWT_KEY!;

  const token = jwt.sign(tokenModel, jwtKey, { expiresIn: 3 * 60 * 1000 });

  return token;
};

export const validateToken = (token: string): JwtModel => {
  const jwtKey = process.env.JWT_KEY!;

  const tokenModel = <JwtModel>jwt.verify(token, jwtKey);

  return tokenModel;
};
