import { configureStore } from '@reduxjs/toolkit';
import { _99phantramApi } from './api';

export const store = configureStore({
  reducer: {
    [_99phantramApi.reducerPath]: _99phantramApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(_99phantramApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
