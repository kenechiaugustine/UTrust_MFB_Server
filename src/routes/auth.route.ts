import express, { Router } from 'express';

import { validate } from '../middlewares/validate';
import * as authValidator from '../validators/auth.validators';
import * as register from '../controllers/auth/register.controller';
import * as login from '../controllers/auth/login.controller';
import { logout } from '../controllers/auth/logout.controller';
const router: Router = express.Router();

router.post('/register', validate(authValidator.register), register.register);
router.post('/login', validate(authValidator.login), login.login);
router.post('/logout', logout);

export { router as authRouter };
