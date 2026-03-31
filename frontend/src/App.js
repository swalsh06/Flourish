import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import './App.css';
import { useState } from 'react';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      
    </Routes>
  );
}

export default App;