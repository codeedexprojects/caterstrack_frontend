import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLogin from './Components/Admin/AdminLogin';
import AdminHome from './Pages/Admin/AdminHome';
import Dashboard from './Components/Admin/Dashboard';
import UsersList from './Components/Admin/UsersList';
import FaresList from './Components/Admin/FaresList';
import Works from './Components/Admin/Works';

import SubAdminLogin from './Pages/SubAdmin/SubAdminLogin';
import SubAdminHome from './Pages/SubAdmin/SubAdminHome';
import SubAdminDashboard from './Pages/SubAdmin/dashboard';
import CreateUser from './Components/SubAdmin/User';
import WorkAnalytics from './Components/Admin/WorkAnalytics';
import CateringWorks from './Components/SubAdmin/CateringWorks';

import { AdminRoute, SubAdminRoute } from './PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/subadmin/login" element={<SubAdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminHome />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="fares" element={<FaresList />} />
            <Route path="works" element={<Works />} />
            <Route path="work-analytics" element={<WorkAnalytics />} />
          </Route>
        </Route>

        {/* SubAdmin Protected Routes */}
        <Route path="/subadmin" element={<SubAdminRoute />}>
          <Route element={<SubAdminHome />}>
            <Route index element={<Navigate to="/subadmin/sub-dashboard" replace />} />
            <Route path="sub-dashboard" element={<SubAdminDashboard />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="catering-works" element={<CateringWorks />} />
          </Route>
        </Route>

        {/* Redirect root to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;