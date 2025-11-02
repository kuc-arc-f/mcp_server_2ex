//const express = require('express');
import express from 'express';
const router = express.Router();
//require('dotenv').config();
import axios from 'axios';

/*****************************
todos -index
******************************/
router.post('/send_post', async function(req: any, res: any) {
  try {
    //console.log("url=", process.env.API_URL);
    const url = import.meta.env.VITE_API_URL; 
//console.log(req.body);
    const path = req.body.api_url;	
console.log("path=", url + path);
    const response = await axios.post(url + path, req.body, 
    {headers: { 'Content-Type': 'application/json'}
    });
    const data = response.data;
//console.log(data);
    //@ts-ignore
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/send_post_d8', async function(req: any, res: any) {
  try {
    const url = process.env.PUBLIC_API_URL; 
    const apiKey = process.env.PUBLIC_API_KEY; 
    console.log("url=", url);
//console.log(req.body);
    const item = req.body;
    const path = item.api_url;	
console.log("path=", url + path);
    item.api_key = apiKey;
    const sendBody: any = JSON.stringify(item);	
    const resp = await fetch(url + path, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: sendBody
    });
    const json = await resp.json()
    if (resp.status !== 200) {
      console.error("error, status <> 200");
      throw new Error(await resp.text());
    }
    return res.json(json);
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
router.post('/send_post_plan', async function(req: any, res: any) {
  try {
    const url = process.env.PUBLIC_API_URL; 
    const apiKey = process.env.PUBLIC_API_KEY; 
    //console.log(req.body);
    const path = req.body.path;	
    const item = req.body.data;
//console.log(item.data);
    //console.log("path=", url + path);
    item.api_key = apiKey;
    console.log(item);
    const sendBody: any = JSON.stringify(item);	
    const resp = await fetch(url + path, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: sendBody
    });
    const json = await resp.json()
    if (resp.status !== 200) {
      console.error("error, status <> 200");
      throw new Error(await resp.text());
    }
    return res.json(json);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/get_sys_items', async function(req: any, res: any) {
  const retObj = {ret: 500 , message: "" }
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
    //console.log(body);
    retObj.ret = 200;
    retObj.data = { 
      api_url: process.env.EXTERNAL_API_URL , 
      GOOGLE_AUTH_API_KEY: process.env.GOOGLE_AUTH_API_KEY ,
      SPREADSHEET_ID_1: process.env.SPREADSHEET_ID_1 ,
      SPREADSHEET_ID_2: process.env.SPREADSHEET_ID_2 ,
      APPSHEET_URL: process.env.APPSHEET_URL ,
    };
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
