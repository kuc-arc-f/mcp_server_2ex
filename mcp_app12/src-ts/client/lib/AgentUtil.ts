import { marked } from 'marked';

const resultText = "";

const AgentUtil = {

  validAgent: function (message: string){
    let ret = false;

    if(message.indexOf("sheet-list-agent") >= 0){
      return true;
    }
    //price-list-up-agent 200 JPY以上
    if(message.indexOf("price-list-up-agent") >= 0){
      return true;
    }

    return ret;
  },
  /*
  *
  * @param
  *
  * @return
  */
  validAgentName: function (message: string): string {
    let ret = null;

    //if(message.indexOf("sheet-list-agent") >= 0){
    //  return "sheet-list-agent";
    //}
    //price-list-up-agent 200 JPY以上
    if(message.indexOf("price-list-up-agent") >= 0){
      return "price-list-up-agent";
    }
    if(message.indexOf("price-list-updown-agent") >= 0){
      return "price-list-updown-agent";
    }
    if(message.indexOf("first-agent") >= 0){
      return "first-agent";
    }

    return ret;
  },

  /*
  *
  * @param
  *
  * @return
  */
  startAgent: async function(){
    try{
      let text = "### Step1: リストを markdown記法の表形式で表示" + "\n";
      let json = await this.postAgent("getSheetTestで、リストを markdown記法の表形式で表示して欲しい");
      text += json.text;

      text += "### Step2: 一覧のCSVダウンロードのリンク表示" + "\n";;
      json = await this.postAgent("getSheetCsvで。一覧のCSVダウンロードのリンク表示して欲しい。");
      text += json.text;

      let htm = marked.parse(text);
      return htm;
    }catch(e){
      console.error(e);
      throw new Error('Error , startAgent');
    }
  },

  /*
  *
  * @param
  *
  * @return
  */
  postAgent: async function(inText: string) {
    try{
      const item = {messages: inText};
      const body: any = JSON.stringify(item);		
      const res = await fetch("/api/chat", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: body
      });
      if(res.ok === false){
       throw new Error("res.OK = NG"); 
      };
      const json = await res.json();
      console.log(json);
      if(json.ret !== 200){
        throw new Error('res.ret = NG');
      }
      return json
    }catch(e){
      console.error(s);
      throw new Error('Error , postAgent');
    }
  } ,

}

export default AgentUtil;
