import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Pricing from './pages/Pricing';
import Alerts from './pages/Alerts';
import Budgets from './pages/Budgets';
import Optimization from './pages/Optimization';
import Profile from './pages/Profile';
import TestAPILogger from './pages/TestAPILogger';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="logs" element={<Logs />} />
          <Route path="test-logger" element={<TestAPILogger />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="optimization" element={<Optimization />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
