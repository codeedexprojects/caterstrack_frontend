import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './Api/Admin/AdminAuthSlice';
import faresReducer from './Api/Admin/FareSlice'
import usersReducer from './Api/Admin/UserSlice'

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    fares: faresReducer,
    users: usersReducer

  },
});

export default store;