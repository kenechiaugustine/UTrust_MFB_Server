import express, { Router } from 'express';
import * as controller from '../controllers/account/account.controller';
const router: Router = express.Router();
import { validate } from '../middlewares/validate';
import * as accountValidator from '../validators/account.validators';

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account management and transactions
 */

/**
 * @swagger
 * /account/deposit:
 *   post:
 *     summary: Deposit funds into a user's account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the deposit.
 *               amount:
 *                 type: number
 *                 format: double
 *                 description: The amount to deposit.
 *             example:
 *               userId: "60c72b2f9b1d8c001f8e4b1a"
 *               amount: 150.75
 *     responses:
 *       "200":
 *         description: Funds deposited successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User' # Assuming you define a User schema
 *       "400":
 *         description: Bad Request (e.g., invalid input).
 *       "404":
 *         description: User not found.
 */
router.post('/deposit', validate(accountValidator.depositFundsValidator), controller.depositFunds);


/**
 * @swagger
 * /account/withdraw:
 *   post:
 *     summary: Withdraw funds from a user's account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the withdrawal.
 *               amount:
 *                 type: number
 *                 format: double
 *                 description: The amount to withdraw.
 *             example:
 *               userId: "60c72b2f9b1d8c001f8e4b1a"
 *               amount: 50
 *     responses:
 *       "200":
 *         description: Funds withdrawn successfully.
 *       "400":
 *         description: Bad Request (e.g., insufficient funds).
 *       "404":
 *         description: User not found.
 */
router.post('/withdraw', validate(accountValidator.withdrawFundsValidator), controller.withdrawFunds);


/**
 * @swagger
 * /account/verify-account:
 *   post:
 *     summary: Verify an account number and get account holder's name
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *             properties:
 *               accountNumber:
 *                 type: number
 *                 description: The account number to verify.
 *             example:
 *               accountNumber: 1234567890
 *     responses:
 *       "200":
 *         description: Account details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountName:
 *                   type: string
 *                 accountNumber:
 *                   type: number
 *               example:
 *                 accountName: "John Doe"
 *                 accountNumber: 1234567890
 *       "404":
 *         description: Account with the specified number not found.
 */
router.post('/verify-account', validate(accountValidator.verifyAccountValidator), controller.verifyAccount);


/**
 * @swagger
 * /account/transfer:
 *   post:
 *     summary: Transfer funds from one user to another
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverAccountNumber
 *               - amount
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: The ID of the user sending the funds.
 *               receiverAccountNumber:
 *                 type: number
 *                 description: The account number of the recipient.
 *               amount:
 *                 type: number
 *                 format: double
 *                 description: The amount to transfer.
 *             example:
 *               senderId: "60c72b2f9b1d8c001f8e4b1a"
 *               receiverAccountNumber: 9876543210
 *               amount: 100
 *     responses:
 *       "200":
 *         description: Transfer successful.
 *       "400":
 *         description: Bad Request (e.g., insufficient funds, cannot transfer to self).
 *       "404":
 *         description: Sender or Receiver not found.
 */
router.post('/transfer', validate(accountValidator.transferFundsValidator), controller.transferFunds);


export { router as accountRouter };