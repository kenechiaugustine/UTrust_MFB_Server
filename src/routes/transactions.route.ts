import express, { Router } from 'express';
import * as controller from '../controllers/transactions/transactions.controller';
const router: Router = express.Router();

router.get('/', controller.getAllTransactions);
router.get('/:id', controller.getOneTransaction);
export { router as transactionRouter };
