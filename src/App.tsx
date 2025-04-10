import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

const API_URL = 'https://todo-back-i055.onrender.com/api/todos';
// const API_URL = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);
  
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        text: newTodo,
        completed: false,
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id: string, text: string) => {
    try {
      await axios.put(`${API_URL}/${id}`, { text });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, text } : todo
      ));
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Todo App</h1>
        
        <form onSubmit={addTodo} className="todo-form">
          <div className="form-group">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="todo-input"
            />
            <button
              type="submit"
              className="add-button"
              aria-label="Add Todo"
            >
              <PlusIcon className="icon" />
            </button>
          </div>
        </form>

        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="todo-item"
            >
              {editingTodo?._id === todo._id ? (
                <div className="edit-group">
                  <input
                    type="text"
                    value={editingTodo.text}
                    onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
                    className="edit-input"
                    autoFocus
                  />
                  <button
                    onClick={() => updateTodo(todo._id, editingTodo.text)}
                    className="save-button"
                    aria-label="Save Todo"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="cancel-button"
                    aria-label="Cancel Edit"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="todo-content">
                  <div className="todo-info">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id, !todo.completed)}
                      className="todo-checkbox"
                      aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.text}
                    </span>
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => setEditingTodo(todo)}
                      className="edit-button"
                      aria-label={`Edit ${todo.text}`}
                      title="Edit"
                    >
                      <PencilIcon className="icon" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="delete-button"
                      aria-label={`Delete ${todo.text}`}
                      title="Delete"
                    >
                      <TrashIcon className="icon" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;