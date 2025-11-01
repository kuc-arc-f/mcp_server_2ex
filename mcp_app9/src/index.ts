
import express from 'express';
import cookieParser from "cookie-parser";
import path from 'node:path';
import { fileURLToPath } from 'url';
import { renderToString } from 'react-dom/server';

import LibConfig from './lib/LibConfig';
import userRouter from './routes/user';
import todoRouter from './routes/todo';
import commonRouter from './routes/common';

const app = express();
import 'dotenv/config'

import Top from './pages/App';
//const __filename = fileURLToPath(import.meta.url);
//let __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
//console.log("env=", process.env.NODE_ENV)
//console.log("__dirname=", __dirname)
//console.log(process.env);

const errorObj = {ret: "NG", messase: "Error"};

app.use('/api/common', commonRouter);
app.use('/api/user', userRouter);
app.use('/api/todo', todoRouter);

//Middleware
app.get('/*', function(req, res, next) {
  const COOKIE_NAME = LibConfig.COOKIE_NAME;
  //console.log(req.cookies[ COOKIE_NAME ]);
  if (req.path !== "/login") {
    if (!req.cookies[ COOKIE_NAME ]) {
      return res.redirect('/login');
    }
  }
  next();
});

// SPA
app.get('/*', (req: any, res: any) => {
  try {
    res.send(renderToString(Top()));
  } catch (error) {
    res.sendStatus(500);
  }
});

//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
console.log('start');
