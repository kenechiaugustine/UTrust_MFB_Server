import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

interface TransactionAttrs {
  user: string;
  prevBalance: string;
  newBalance: string;
  amount: string;
  transactionType: string;
  modeOfTransaction: string;
  description: string;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

export interface TransactionDoc extends mongoose.Document {
  user: string;
  prevBalance: string;
  newBalance: string;
  amount: string;
  transactionType: string;
  modeOfTransaction: string;
  description: string;
}

const TransactionSchema = new Schema(
  {
    user: {
      type: String,
      ref: 'Users',
      required: true,
    },
    prevBalance: {
      type: Number,
      default: 0,
    },
    newBalance: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    transactionType: {
      type: String,
      default: 'credit',
      enum: ['credit', 'debit'],
    },
    modeOfTransaction: {
      type: String,
      default: 'deposit',
      enum: ['deposit', 'withdrawal', 'transfer'],
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    collection: 'Transactions',
  },
);

const Transaction = mongoose.model<TransactionDoc, TransactionModel>('Transactions', TransactionSchema);

export { Transaction };
