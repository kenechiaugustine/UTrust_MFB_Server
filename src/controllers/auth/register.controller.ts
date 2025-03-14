import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { apiresponse } from '../../utils/response';
import { User } from '../../models/user.model';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  const user = await User.create({ email, password, firstName, lastName });
  //@ts-ignore
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  user.authToken = token;
  await user.save();
  res.cookie('authToken', token, { httpOnly: true });
  return apiresponse(201, 'User registered successfully', user, res);
};
