import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const isLoggedIn = useSelector((state) => state.adminAuth.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
