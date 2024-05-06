import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/users.js';
import noteRoutes from './routes/notes.js';
import logger from './middleware/logger.js';
import limiter from './middleware/rateLimiter.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from  './utils/passportConfig.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const store = MongoStore.create({ mongoUrl: process.env.MONGO_STRING });

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());


  
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8000', 'http://127.0.0.1:5173'], 
    credentials: true
}));
// // app.use(cors("*"));  
// app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true, 
  store: store,
  cookie: {
    secure: false, 
    sameSite: 'lax', 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger);
app.use(limiter);

app.use(express.static('public'));

app.use('/user', userRoutes);
app.use('/note', noteRoutes);
app.use('/images/event', express.static(path.join(__dirname, 'images/event')));
app.use('/images/user_image', express.static(path.join(__dirname, 'images/user_image')));




export default app;