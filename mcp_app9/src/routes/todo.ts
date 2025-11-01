import express from 'express';
import LibConfig from "../lib/LibConfig";
import RpcClient from '../lib/RpcClient'
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const CMD_PATH = __dirname + "/rust_mcp_server_9"
import 'dotenv/config'

const router = express.Router();
console.log("CMD_PATH=", CMD_PATH);

router.post('/create', async function(req: any, res: any) {
  const retObj = {ret: 500, data: null};
  try {
    const body = req.body
    console.log(body);
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "data_create", 
        arguments:{
          content: "todo",
          data: body.data
        }          
      },
    );
    client.close();    
  //console.log("add:", resp);
   retObj.ret = 200;
   return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/list', async function(req: any, res: any) {
  const retObj = {ret: 500, data: null};
  try {
    const body = req.body
    console.log(body);
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "data_list", 
        arguments:{
          content: "todo",
        }          
      },
    );
    client.close();    
  //console.log("add:", resp);
    const out = [];
    if(resp.content[0]){
      const json = JSON.parse(resp.content[0].text)
      console.log(json)
      let rowData = null;
      json.forEach((item=>{
        console.log(item.id)
        rowData = JSON.parse(item.data)
        console.log(rowData)
        item.data = rowData;
        out.push(item)
      }));
      console.log(out)
    }

   retObj.ret = 200;
   retObj.data = out;
   return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/delete', async function(req: any, res: any) {
  const retObj = {ret: 500, data: null};
  try {
    const body = req.body
    console.log(body);
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "data_delete", 
        arguments:{
          content: "todo",
          id: body.id
        }           
      },
    );
    client.close();    
  //console.log("add:", resp);
   retObj.ret = 200;
   return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


router.post('/update', async function(req: any, res: any) {
  const retObj = {ret: 500, data: null};
  try {
    const body = req.body
    console.log(body);
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "data_update", 
        arguments:{
          id: body.id,
          content: "todo",
          data: body.data
        }          
      },
    );
    client.close();    
  //console.log("add:", resp);
   retObj.ret = 200;
   return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
export default router;
