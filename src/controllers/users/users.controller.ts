import * as BaseService from './../default.handler';
import { User } from '../../models/user.model';

export const getAllUsers = BaseService.getAll(User);

export const getOneUser = BaseService.getOne(User);

export const updateUser = BaseService.updateOne(User);

export const deleteUser = BaseService.removeOne(User);
