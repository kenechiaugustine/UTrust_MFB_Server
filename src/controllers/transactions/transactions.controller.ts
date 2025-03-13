import * as BaseService from './../default.handler';
import { Transaction } from '../../models/transactions.model';

export const getAllTransactions = BaseService.getAll(Transaction);
export const getOneTransaction = BaseService.getOne(Transaction);
