import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './Api/Admin/AdminAuthSlice';
import faresReducer from './Api/Admin/FareSlice'
import usersReducer from './Api/Admin/UserSlice'
import workReducer from './Api/Admin/WorkSlice'
import SubAdminAuthReducer from './Api/SubAdmin/SubLoginSlice'
import subDashbaordReducer from './Api/SubAdmin/DashboardSlice'
import userAuthReducer from './Api/User/UserAuthSlice'

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    fares: faresReducer,
    users: usersReducer,
    work: workReducer,
    subAdminAuth : SubAdminAuthReducer,
    subDashboard : subDashbaordReducer,
    userAuth: userAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;