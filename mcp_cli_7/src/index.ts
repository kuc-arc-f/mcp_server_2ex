
import express from 'express';
import cookieParser from "cookie-parser";
import path from 'node:path';
import { fileURLToPath } from 'url';
import { renderToString } from 'react-dom/server';
import { google } from "@ai-sdk/google";
import { generateText } from 'ai';

import { addPriceList } from './tools/addPriceList';
import { getPriceXlsxList } from './tools/getPriceXlsxList';

import LibConfig from './lib/LibConfig';
import userRouter from './routes/user';
import commonRouter from './routes/common';

const app = express();
import 'dotenv/config'

import Top from './pages/App';
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env=", process.env.NODE_ENV)
//console.log("__dirname=", __dirname)
//console.log(process.env);

const errorObj = {ret: "NG", messase: "Error"};
const MODEL_NAME = "gemini-2.5-flash";

app.use('/api/common', commonRouter);
app.use('/api/user', userRouter);

// API
app.post('/api/chat', async (req: any, res: any) => {
  try {
    const body = req.body;
    console.log(body)

    const result = await generateText({
      model: google(MODEL_NAME),
      tools: {
        addPriceList,
        getPriceXlsxList,
      },
      maxSteps: 5,
      messages: [{ role: "user", content: body.messages }],
    });
    console.log("artifact:");
    console.log(result.text);

    res.send({ret: 200, text: result.text});
  } catch (error) {
    res.sendStatus(500);
  }
});
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
