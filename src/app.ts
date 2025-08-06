import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import koii from 'koii';

// Swagger Imports
import { swaggerSpec } from './config/swagger.config'; // Adjust path if needed
import swaggerUi from 'swagger-ui-express';

// IMPORTING ROUTERS
import { authRouter } from './routes/auth.route';
// @ts-ignore
import xss from 'xss-clean';
import { userRouter } from './routes/user.route';
import { accountRouter } from './routes/account.route';
import { transactionRouter } from './routes/transactions.route';
import AppError from './errors/AppError';
import { errorHandler } from './errors/error.controller';

// INITIALIZE EXPRESS
const app: Express = express();

// ... (all your existing middleware like view engine, cors, helmet, etc.)
// KEEP ALL THE MIDDLEWARE FROM YOUR ORIGINAL FILE HERE
app.enable('view cache');
app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    defaultLayout: '_base',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir: path.join(__dirname, 'views/components'),
  }),
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
//@ts-ignore
app.options('*', cors());
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  skipSuccessfulRequests: true,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(xss());


// ROUTING / APP ENDPOINTS
// Index Route || Views Route
app.get('/', (req: Request, res: Response) => {
  res.render('index', {
    title: 'Home Page',
  });
});

// Swagger UI Route - must be before API routes if you have a catch-all
//@ts-ignore
app.use('/docs', ...swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// API ENDPOINTS
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/transactions', transactionRouter);

// 404 - ERROR HANDLING
app.use((req: Request, res: Response, next: NextFunction) => {
  throw new AppError('Error occurred: Invalid Endpoint', 404);
});

app.use(koii);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;