import { google } from "@ai-sdk/google";
import { generateText } from 'ai';
import { getSheetTest } from '../tools/getSheetTest';
import { getSheetCsv } from '../tools/getSheetCsv';
import { getPriceParam } from '../tools/getPriceParam';
import { getPriceListUp } from '../tools/getPriceListUp';
import { getPriceUpTotal } from '../tools/getPriceUpTotal';
import { getPriceUpDown } from '../tools/getPriceUpDown';
import { getPriceUpDownTotal } from '../tools/getPriceUpDownTotal';
import { firstGetRandom } from '../tools/firstGetRandom';
import { firstGetDate } from '../tools/firstGetDate';
import { firstGetTime } from '../tools/firstGetTime';


const resultText = "";
const MODEL_NAME = "gemini-2.0-flash";

const AgentUtil = {

  /*
  *
  * @param
  *
  * @return
  */
  sendTool: async function(messages: string) {
    try{
      const result = await generateText({
      model: google(MODEL_NAME),
        tools: {
          getSheetTest , getSheetCsv , getPriceParam , getPriceListUp ,
          getPriceUpTotal , getPriceUpDown , getPriceUpDownTotal , 
          firstGetRandom , firstGetDate , firstGetTime ,
        },
        maxSteps: 5,
        messages: [{ role: "user", content: messages }],
      });
      console.log("artifact:");
      console.log(result.text);
      return result.text;
    }catch(e){
      console.error(s);
      throw new Error('Error , sendTool');
    }
  } ,

  validateNumber: function(value: any){
    let ret = false;
    if (typeof value === 'number') {
      console.log("type=number");
      return true;
    }
    return ret;
  },

}

export default AgentUtil;
