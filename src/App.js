import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import SignupForm from './Pages/SignupForm';
import Progress from './Pages/Progress';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/project/:id/tasks" element={<Progress/>}/>
      </Routes>
    </AuthProvider>
  );
};

export default App;
