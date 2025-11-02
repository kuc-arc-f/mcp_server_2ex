
import {useState}  from 'react';
import ApiUtil from '../lib/ApiUtil';
import Head from '../components/Head';

export default function Chat() {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testStart = async function(){
    try{    
      const item = JSON.stringify({
        title: "tit3", body: "c1"
      });          
      const body: any = JSON.stringify(item);		
      const res = await fetch("/api/test/create", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: JSON.stringify({
          content: "todo", data: item
        }),
      });
      const json = await res.json();
      console.log(json);
    } catch(e){
      console.error(e);
    }
  }

  return (
  <div className="mb-[200px]">
    <Head />
    <div className="flex flex-col w-full max-w-3xl py-4 mx-auto gap-4">
      <div className="flex flex-col gap-2 px-4 bg-white">
        <h1 className="text-2xl font-bold">home</h1>
        <hr />
        {/*
        <button onClick={()=>{testStart()}}>[ test ]</button>
        */}

      </div>

    </div>
  </div>

  );
}