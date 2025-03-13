import express, { Router } from 'express';
import * as controller from '../controllers/account/account.controller';
const router: Router = express.Router();
import { validate } from '../middlewares/validate';
import * as accountValidator from '../validators/account.validators';

router.post('/deposit', validate(accountValidator.depositFundsValidator), controller.depositFunds);
router.post('/withdraw', validate(accountValidator.withdrawFundsValidator), controller.withdrawFunds);
router.post('/verify-account', validate(accountValidator.verifyAccountValidator), controller.verifyAccount);
router.post('/transfer', validate(accountValidator.transferFundsValidator), controller.transferFunds);

export { router as accountRouter };
