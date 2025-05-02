import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import koii from 'koii';

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

// MIDDLEWARE
// app.set('trust proxy', true);
// app.set('trust proxy', ['127.0.0.1', '::1', '10.0.0.0/24', '203.0.113.0/24']);

app.enable('view cache');

/////////// VIEW ENGINE ///////////
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

/////////// STATIC FILES ///////////
app.use(express.static(path.join(__dirname, 'public')));

/////////// C O R S ///////////
app.use(cors());
//@ts-ignore
app.options('*', cors());

/////// SECURITY HTTP HEADERS ///////
app.use(helmet());

/////// Rate limiter ///////////////
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  skipSuccessfulRequests: true,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//////////// JSON ////////////
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// ROUTING / APP ENDPOINTS
// Index Route || Views Route
app.get('/', (req: Request, res: Response) => {
  res.render('index', {
    title: 'Home Page',
  });
});

// API ENDPOINTS
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/transactions', transactionRouter);

// 404 - ERROR HANDLING
app.use((req: Request, res: Response, next: NextFunction) => {
  throw new AppError('Error occurred: Invalid Endpoint', 404);
});

// OR

// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//     throw new CustomError("Error occurred: Invalid Endpoint", 404)
// })

app.use(koii);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
