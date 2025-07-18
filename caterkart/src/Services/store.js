import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './Api/Admin/AdminAuthSlice';
import faresReducer from './Api/Admin/FareSlice'
import usersReducer from './Api/Admin/UserSlice'
import workReducer from './Api/Admin/WorkSlice'
import SubAdminAuthReducer from './Api/SubAdmin/SubLoginSlice'

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    fares: faresReducer,
    users: usersReducer,
    work: workReducer,
    subAdminAuth : SubAdminAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;