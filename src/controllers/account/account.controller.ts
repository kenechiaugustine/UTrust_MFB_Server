import { User } from '../../models/user.model';
import { apiresponse } from '../../utils/response';
import AppError from '../../errors/AppError';
import { Request, Response } from 'express';
import { Transaction } from '../../models/transactions.model';

export const depositFunds = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new AppError('User with id not found', 404);
  const prevBalance = user.accountBalance;
  user.accountBalance = prevBalance + amount;
  await user.save();

  await Transaction.create({
    user: user._id,
    prevBalance: prevBalance,
    newBalance: user.accountBalance,
    amount: amount,
    transactionType: 'credit',
    modeOfTransaction: 'deposit',
  });
  return apiresponse(200, 'Funds deposited successfully', user, res);
};

export const withdrawFunds = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new AppError('User with id not found', 404);
  if (user.accountBalance < amount) throw new AppError('Insufficient funds', 400);
  const prevBalance = user.accountBalance;
  user.accountBalance = prevBalance - amount;
  await user.save();

  await Transaction.create({
    user: user._id,
    prevBalance: prevBalance,
    newBalance: user.accountBalance,
    amount: amount,
    transactionType: 'debit',
    modeOfTransaction: 'withdrawal',
  });
  return apiresponse(200, 'Funds withdrawn successfully', user, res);
};

export const verifyAccount = async (req: Request, res: Response) => {
  const { accountNumber } = req.body;
  const user = await User.findOne({ accountNumber });
  if (!user) throw new AppError('User with account number not found', 404);
  return apiresponse(200, 'Account details retrieved', { accountName: user.firstName + ' ' + user.lastName, accountNumber: user.accountNumber }, res);
};

export const transferFunds = async (req: Request, res: Response) => {
  const { senderId, receiverAccountNumber, amount } = req.body;
  const sender = await User.findById(senderId);
  if (!sender) throw new AppError('Sender with id not found', 404);
  const receiver = await User.findOne({ accountNumber: receiverAccountNumber });
  if (!receiver) throw new AppError('Receiver account number is invalid', 404);
  if(sender._id.toString() === receiver._id.toString()) throw new AppError(`You cannot transfer funds to yourself`, 400)
  if (sender.accountBalance < amount) throw new AppError('Insufficient funds', 400);
  const senderPrevBalance = sender.accountBalance;
  const receiverPrevBalance = receiver.accountBalance;
  sender.accountBalance = senderPrevBalance - amount;
  await sender.save();
  await Transaction.create({
    user: sender._id,
    prevBalance: senderPrevBalance,
    newBalance: sender.accountBalance,
    amount: amount,
    transactionType: 'debit',
    modeOfTransaction: 'transfer',
  });

  receiver.accountBalance += amount;
  await receiver.save();
  await Transaction.create({
    user: receiver._id,
    prevBalance: receiverPrevBalance,
    newBalance: receiver.accountBalance,
    amount: amount,
    transactionType: 'credit',
    modeOfTransaction: 'transfer',
  });

  return apiresponse(200, 'Transfer successful', true, res);
};
