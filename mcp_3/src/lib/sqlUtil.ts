import { createClient } from "@libsql/client";

const sqlUtil = {

  getClient: async function(url, token){
    try{
      if (url === undefined) {
        throw new Error("TURSO_DATABASE_URL env var is not defined");
      }
      const authToken = token;
      if (authToken == undefined) {
        throw new Error("TURSO_AUTH_TOKEN env var is not defined");
      }
      return createClient({ url, authToken });      
    }catch(e){ 
      console.log(e);
      throw new Error("error, getClient")
    }
  },

}
export default sqlUtil;
