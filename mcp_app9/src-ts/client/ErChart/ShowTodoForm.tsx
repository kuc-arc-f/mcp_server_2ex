import React, { useState, useEffect } from 'react';
//import './chart.css';

// 編集フォームコンポーネント
function Compo({ todo, onUpdateTodo, onClose, errors }) {
  const [title, setTitle] = useState(todo.data.title);
  const [content, setContent] = useState(todo.data.body);
  const [completed, setCompleted] = useState(todo.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateTodo({ ...todo, title, content, completed });
  };

  return (
  <>
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row">
        <div className="flex-3 text-center p-2 m-1">
          <input
            type="text"
            id="title"
            disabled={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`border border-gray-300 px-3 py-2 rounded w-full ${errors.title ? 'border-red-500' : ''}`}
          />
        </div>
        <div className="flex-1 text-end p-2 m-1">
          <button type="button" onClick={onClose} 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>      
      <div className="mb-4">
      </div>
      <div className="iframe-container text-center mb-4">
        <iframe
          id="target_frame"
          title="Inline Frame Example"
          src={`/er_chart_get?id=${todo.id}`}>
        </iframe>
      </div>

    
    </form>
  <style>{`
  .iframe-container {
    height: 500px; 
    width: 100%;
    border: 1px solid #ccc; /* 境界線を見やすくするための例 */
  }
  #target_frame{
    min-height: 80%;
    height: auto;
    width: 100%;
  }
  `}</style>
  </>  
  );
}
export default Compo;