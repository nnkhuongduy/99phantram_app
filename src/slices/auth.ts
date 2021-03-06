import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'src/models/user';
import { authApi } from 'src/services/auth';
import { RootState } from './store';

interface AuthState {
  identifier?: User;
  token?: string;
}

const initialState: AuthState = {
  identifier: undefined,
  token: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setJwtToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
    logout: (state) => {
      state.token = undefined;
      state.identifier = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.identifier = payload.identifier;
        state.token = payload.token;
      }
    );
    builder.addMatcher(
      authApi.endpoints.authenticate.matchFulfilled,
      (state, { payload }) => {
        state.identifier = payload;
      }
    );
  },
});

export const { setJwtToken, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.identifier;

export default authSlice.reducer;
