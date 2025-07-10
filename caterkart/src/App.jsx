import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AdminLogin from './Components/Admin/AdminLogin';
import AdminHome from './Pages/AdminHome';
import Dashboard from './Components/Admin/Dashboard';
import UsersList from './Components/Admin/UsersList';
import FaresList from './Components/Admin/FaresList';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected admin routes */}
        <Route path="/admin" element={<PrivateRoute />}>
          <Route element={<AdminHome />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="fares" element={<FaresList />} />
          </Route>
        </Route>
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;