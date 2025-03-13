import express, { Router } from 'express';
import * as controller from '../controllers/users/users.controller';
const router: Router = express.Router();

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getOneUser);
export { router as userRouter };
