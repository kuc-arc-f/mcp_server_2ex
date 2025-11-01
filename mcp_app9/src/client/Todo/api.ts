import { Item, NewItem } from '../types/Item';
const CONTENT = "todo";

export const itemsApi = {
  getAll: async (content: string): Promise<Item[]> => {
    const res = await fetch("/api/todo/list", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},      
      body: JSON.stringify({
        content: "todo"
      }),
    });
    const json = await res.json();
    console.log(json);    
    return json
/*
    let dataValue = {};
    const newItems = [];
    resp.data.data.forEach((element) => {
      console.log(element.data);
      try{
        dataValue = JSON.parse(element.data);
        element.data = dataValue;
      }catch(e){
        console.error(e);
      }
      newItems.push(element);
    });    
    console.log(newItems);    
    return newItems;
*/
  },

  getById: async (id: number): Promise<Item> => {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }
    return response.json();
  },

  create: async (item: NewItem): Promise<Item> => {
    console.log(item);
    const send = JSON.stringify(item);
    const res = await fetch("/api/todo/create", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},      
      body: JSON.stringify({
        content: "todo", data: send
      }),
    });
    const json = await res.json();
    console.log(json);    
    return json    
  },

  update: async (id: number, item: Partial<NewItem>): Promise<Item> => {
    //item.id = id;
    console.log(item);
    const send = JSON.stringify(item);
    const res = await fetch("/api/todo/update", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},      
      body: JSON.stringify({
        content: "todo", data: send, id: id,
      }),
    });
    const json = await res.json();
    console.log(json);    
    return json        
  },

  delete: async (id: number): Promise<void> => {
    //const item = { id: id }
    const res = await fetch("/api/todo/delete", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},      
      body: JSON.stringify({
        content: "todo", id: id
      }),
    });
    const json = await res.json();
    console.log(json);    
    return json    
  },
};