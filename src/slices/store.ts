import { configureStore } from '@reduxjs/toolkit';

import { _99phantramApi } from './api';
import authReducer from './auth';
import globalReducer from './global';
import userReducer from './user';

export const store = configureStore({
  reducer: {
    [_99phantramApi.reducerPath]: _99phantramApi.reducer,
    global: globalReducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(_99phantramApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
