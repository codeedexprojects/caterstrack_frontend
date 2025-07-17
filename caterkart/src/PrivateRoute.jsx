import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

 export const AdminRoute = () => {
  const isLoggedIn = useSelector((state) => state.adminAuth.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export const SubAdminRoute = () => {
  const isLoggedIn = useSelector((state) => state.SubAdminAuth.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/signin" replace />;
};