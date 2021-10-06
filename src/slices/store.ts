import { configureStore } from '@reduxjs/toolkit';

import { _99phantramApi } from './api';
import authReducer from './auth';

export const store = configureStore({
  reducer: {
    [_99phantramApi.reducerPath]: _99phantramApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(_99phantramApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
