// File: src/Components/RedirectToUserWorkDetails.jsx
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const RedirectToUserWorkDetails = () => {
  const { id } = useParams();
  return <Navigate to={`/user/work-details/${id}`} replace />;
};

export default RedirectToUserWorkDetails;