import sqlUtil from "../lib/sqlUtil";

const purchase = {

  addPurchase: async function(name: string, price: number){
    try{
      const db_url = process.env.TURSO_DATABASE_URL;
      const db_token = process.env.TURSO_AUTH_TOKEN;
      //console.log("db_url=", db_url);
      const client = await sqlUtil.getClient(db_url, db_token)
      const item = {
        name: name, price: price
      }
      const now = new Date().toISOString();
      const sql_str = `INSERT INTO item_price (data) VALUES(?);`;
      console.log("sql=", sql_str);
      const data_str = JSON.stringify(item);

      await client.execute({
        sql: sql_str,
        args: [data_str],
      });
    }catch(e){
      console.log(e);
      throw new Error("error, addPurchase");
    }
  },

  listPurchase: async function(){
    try{
      const db_url = process.env.TURSO_DATABASE_URL;
      const db_token = process.env.TURSO_AUTH_TOKEN;
      console.log("db_url=", db_url);
      const client = await sqlUtil.getClient(db_url, db_token)
      const now = new Date().toISOString();
      const sql = `SELECT * FROM item_price ORDER BY created_at DESC LIMIT 5`;
      const resp = await client.execute(sql);
      //console.log(resp);
      return resp.rows
    }catch(e){
      console.log(e);
      throw new Error("error, listPurchase");
    }
  },

}
export default  purchase;