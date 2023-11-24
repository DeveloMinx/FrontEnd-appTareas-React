import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShowTask from './components/showTask';
import AddTaskForm from './components/addTaskForm';
import EditTaskForm from './components/editTaskForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowTask />} />
        <Route path="/agregar" element={<AddTaskForm />} />
        <Route path="/editar/:id" element={<EditTaskForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;