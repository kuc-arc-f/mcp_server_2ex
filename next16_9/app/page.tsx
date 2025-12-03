"use client";
import {useState}  from 'react';

export default function Chat() {
  const [text, setText] = useState<string>("");

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto gap-4">
      <h1 className="text-2xl font-bold">Home</h1>
    </div>
  );
}