import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import  Head from "../components/Head";
import ShowTodoForm  from './ErChart/ShowTodoForm';

const CONTENT = "er_chart";

const todoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }),
});

function App() {
  const [todos, setTodos] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/data/list", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: JSON.stringify({
          content: CONTENT
        }),
      });
      const json = await res.json();
      console.log(json);      
      setTodos(json.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // TODOの取得
  useEffect(() => {
    fetchTodos();
  }, [searchQuery]);

  const handleAddTodo = async (newTodo) => {
    try {
      console.log(newTodo);
      // バリデーション
      todoSchema.parse(newTodo);
      setErrors({});
      const send = JSON.stringify({
        title: newTodo.title, body: newTodo.content
      });
      const res = await fetch("/api/data/create", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: JSON.stringify({
          content: CONTENT,
          data: send,
        }),
      });
      const json = await res.json();
      console.log(json);            
  
      setIsAddModalOpen(false);
      fetchTodos();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error adding todo:', error);
      }
    }
  };

  // TODOの更新
  const handleUpdateTodo = async (updatedTodo) => {
    try {
      console.log(updatedTodo)
      // バリデーション
      todoSchema.parse(updatedTodo);
      setErrors({});
      const send = JSON.stringify({
        title: updatedTodo.title, body: updatedTodo.content
      });
      const res = await fetch("/api/data/update", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: JSON.stringify({
          content: CONTENT,
          id: updatedTodo.id,
          data: send,
        }),
      });
      const json = await res.json();
      console.log(json);      
      
      setIsEditModalOpen(false);
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error updating todo:', error);
      }
    }
  };

  // TODOの削除
  const handleDeleteTodo = async (id) => {
    try {
      if (window.confirm("Delete OK?") === false) {
        return;
      }
      const res = await fetch("/api/data/delete", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: JSON.stringify({
          content: CONTENT,
          id: id,
        }),
      });
      const json = await res.json();
      console.log(json);
      fetchTodos();   
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // ダイアログを開く（追加）
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setErrors({});
  };

  // ダイアログを閉じる（追加）
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setErrors({});
  };

  const openShowModal = (todo) => {
    setEditingTodo(todo);
    setIsShowModalOpen(true);
    setErrors({});
  };
  // ダイアログを開く（編集）
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
    setErrors({});
  };

  // ダイアログを閉じる（編集）
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
    setErrors({});
  };

  const closeShowModal = () => {
    setIsShowModalOpen(false);
    setEditingTodo(null);
    setErrors({});
  };


  return (
  <>
    <div>
      <a href="/" className="font-bold ms-4" > [ Home ]</a>
      <hr className="my-2" />
    </div>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ErChart</h1>

      {/* 追加ボタン */}
      <button onClick={openAddModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        New
      </button>

      {/* TODOリスト */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between border-b border-gray-300 py-2">
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.data.title}
            </span>
            <div>
              {/*
              <span><a href={`/er_chart_show?id=${todo.id}`}
              className="border border-blue-500 text-blue-500 bg-white font-bold py-1 px-2 rounded mx-2"
              >Show</a>
              </span>
              */}
              <button onClick={() => openShowModal(todo)} 
              className="border border-blue-500 text-blue-500 bg-white font-bold py-1 px-2 rounded mr-2">
                Show
              </button>

              <button onClick={() => openEditModal(todo)} 
              className="border border-blue-500 text-blue-500 bg-white font-bold py-1 px-2 rounded mr-2">
                編集
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)} 
              className="border border-red-500 text-red-500 font-bold py-1 px-2 rounded">
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 追加ダイアログ  max-w-md */}
      {isAddModalOpen && (
        <div id="dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-4">New</h2>
            <AddTodoForm onAddTodo={handleAddTodo} onClose={closeAddModal} errors={errors} />
          </div>
        </div>
      )}

      {/* 編集ダイアログ */}
      {isEditModalOpen && editingTodo && (
        <div id="dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-4">Edit</h2>
            <EditTodoForm todo={editingTodo} onUpdateTodo={handleUpdateTodo} onClose={closeEditModal} errors={errors} />
          </div>
        </div>
      )}
      {/* show */}
      {isShowModalOpen && editingTodo && (
        <div id="dialog" 
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl w-full overflow-y-scroll min-h-85">
            <ShowTodoForm todo={editingTodo} onUpdateTodo={handleUpdateTodo} onClose={closeShowModal} errors={errors} />
          </div>
        </div>
      )}

    </div>  
  </>

  );
}

// 追加フォームコンポーネント
function AddTodoForm({ onAddTodo, onClose, errors }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTodo({ title, content });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">タイトル</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`border border-gray-300 px-3 py-2 rounded w-full ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">Content</label>
        <textarea
          id="content"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          追加
        </button>
        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          キャンセル
        </button>
      </div>
    </form>
  );
}

// 編集フォームコンポーネント
function EditTodoForm({ todo, onUpdateTodo, onClose, errors }) {
  const [title, setTitle] = useState(todo.data.title);
  const [content, setContent] = useState(todo.data.body);
  const [completed, setCompleted] = useState(todo.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateTodo({ ...todo, title, content, completed });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">タイトル</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`border border-gray-300 px-3 py-2 rounded w-full ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">Content</label>
        <textarea
          id="content"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          更新
        </button>
        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          キャンセル
        </button>
      </div>
    </form>
  );
}

export default App;
