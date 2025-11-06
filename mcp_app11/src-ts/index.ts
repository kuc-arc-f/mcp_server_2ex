
import express from 'express';
import cookieParser from "cookie-parser";
import path from 'node:path';
import { renderToString } from 'react-dom/server';

import RpcClient from './lib/RpcClient'
import LibConfig from './lib/LibConfig';
import userRouter from './routes/user';
//import dataRouter from './routes/data';
import testRouter from './routes/test';
import MdUtil from './lib/MdUtil';
import commonRouter from './routes/common';

const app = express();
import 'dotenv/config'

import Top from './pages/App';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
const __dirname = process.cwd();
const CMD_PATH = __dirname + "/dist/rust_mcp_server_9"
//console.log("env=", process.env.NODE_ENV)

const errorObj = {ret: "NG", messase: "Error"};

app.use('/api/common', commonRouter);
app.use('/api/user', userRouter);
app.use('/api/test', testRouter);

//Middleware
app.get('/*', function(req, res, next) {
  const COOKIE_NAME = LibConfig.COOKIE_NAME;
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
