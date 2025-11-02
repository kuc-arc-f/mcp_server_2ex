import React from "react";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './client/Home';
import About from './client/about';
import Todo from './client/Todo';
import ErChart from './client/ErChart';
import Login from './client/Login';

export default function App(){
  return(
  <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/er_chart" element={<ErChart />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>

  </div>
  )
}
