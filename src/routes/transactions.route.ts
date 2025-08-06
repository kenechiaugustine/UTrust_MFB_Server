import express, { Router } from 'express';
import * as controller from '../controllers/transactions/transactions.controller';
const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction retrieval
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Retrieve a list of all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: A list of transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       "401":
 *         description: Unauthorized
 */
router.get('/', controller.getAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Retrieve a single transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     responses:
 *       "200":
 *         description: A single transaction.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Transaction not found
 */
router.get('/:id', controller.getOneTransaction);

export { router as transactionRouter };
