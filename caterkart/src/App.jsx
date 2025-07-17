import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AdminLogin from './Components/Admin/AdminLogin';
import AdminHome from './Pages/Admin/AdminHome';
import Dashboard from './Components/Admin/Dashboard';
import UsersList from './Components/Admin/UsersList';
import FaresList from './Components/Admin/FaresList';
import Works from './Components/Admin/Works';
import SubAdminLogin from './Pages/SubAdmin/SubAdminLogin';
import SubAdminHome from './Pages/SubAdmin/SubAdminHome';
import SubAdminDashboard from './Pages/SubAdmin/dashboard';
import {AdminRoute, SubAdminRoute} from './PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/subadmin/login" element={<SubAdminLogin />} />
        
        {/* Protected admin routes */}
        <Route path="/admin" element={<AdminRoute/>}>
          <Route element={<AdminHome />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="fares" element={<FaresList />} />
            <Route path="works" element={<Works />} />
          </Route>
        </Route>

        <Route path="/subadmin" element={<SubAdminRoute/>}>
          <Route element={<SubAdminHome />}>
            <Route index element={<Navigate to="/subadmin/sub-dashboard" replace />} />
            <Route path="sub-dashboard" element={<SubAdminDashboard />} />
          </Route>
        </Route>
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;