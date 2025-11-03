
import express from 'express';
import cookieParser from "cookie-parser";
import path from 'node:path';
import { renderToString } from 'react-dom/server';
const wasm = require('../pkg/wasm_module');

import RpcClient from './lib/RpcClient'
import LibConfig from './lib/LibConfig';
import userRouter from './routes/user';
import dataRouter from './routes/data';
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
app.use('/api/data', dataRouter);

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
app.get('/foo', (req, res) => {
  const message = wasm.foo();
  res.send(message);
});

/**
*
* @param
*
* @return
*/
app.get('/mark_down_show', async (req, res) => {
  const retObj = {ret: 500, data: null};
  try {
    console.log(req.query);
    const id = req.query.id;
    console.log("id=", id);
    if(!id){
      console.error("error, id none");
      throw new Error("error, id none");
    }
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "data_getone", 
        arguments:{
          content: "md_data",
          id: Number(id),
        }          
      },
    );
    client.close();    

    const out = [];
    if(resp.content[0]){
      const json = JSON.parse(resp.content[0].text)
      if(json[0]){
        const target = JSON.parse(json[0].data)
        //console.log(target.body)
        let htm = wasm.convert_md(target.body);
        htm = MdUtil.convertHtmTag(htm)
        const message = await wasm.render_md_show(htm);
        //console.log(message)
        return res.send(message);
      }
    }
    return res.send("");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }  
});

/**
*
* @param
*
* @return
*/
app.get('/er_chart_get', async (req, res) => {
  const retObj = {ret: 500, data: null};
  try {
    console.log(req.query);
    const id = req.query.id;
    console.log("id=", id);
    if(!id){
      console.error("error, id none");
      throw new Error("error, id none");
    }
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "data_getone", 
        arguments:{
          content: "er_chart",
          id: Number(id),
        }          
      },
    );
    client.close();    

    const out = [];
    if(resp.content[0]){
      const json = JSON.parse(resp.content[0].text)
      if(json[0]){
        const target = JSON.parse(json[0].data)
        //console.log(target)
        const message = wasm.render_erchart_show(target.body);
        return res.send(message);
      }
    }
    return res.send("");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }  
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
