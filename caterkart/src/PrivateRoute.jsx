import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AdminRoute = () => {
  const isLoggedIn = useSelector((state) => state.adminAuth.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export const SubAdminRoute = () => {
  const isLoggedIn = useSelector((state) => state.subAdminAuth.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/subadmin/login" replace />;
};

export const UserRoute = () => {
  const isLoggedIn = useSelector((state) => state.userAuth?.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/user/login" replace />;
};

// Higher-order component for protecting individual routes
export const ProtectedRoute = ({ children, userType }) => {
  const adminAuth = useSelector((state) => state.adminAuth.isLoggedIn);
  const subAdminAuth = useSelector((state) => state.subAdminAuth.isLoggedIn);
  const userAuth = useSelector((state) => state.userAuth.isLoggedIn);

  const getRedirectPath = () => {
    switch (userType) {
      case 'admin':
        return '/admin/login';
      case 'subadmin':
        return '/subadmin/login';
      case 'user':
        return '/user/login';
      default:
        return '/user/login';
    }
  };

  const isAuthenticated = () => {
    switch (userType) {
      case 'admin':
        return adminAuth;
      case 'subadmin':
        return subAdminAuth;
      case 'user':
        return userAuth;
      default:
        return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to={getRedirectPath()} replace />;
};