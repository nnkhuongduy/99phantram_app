import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { User } from 'src/models/user';
import { userApi } from 'src/services/user';

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUsers.matchFulfilled,
      (state, { payload }) => {
        state.users = payload.map((user) => {
          return {
            ...user,
            id: user.id || user._id,
            createdOn: user.createdOn || user.createdAt,
            modifiedOn: user.modifiedOn || user.updatedAt,
          } as User;
        });
      }
    );
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        const index = state.users.findIndex(
          (user) => user.id === (payload.id || payload._id)
        );

        state.users[index] = { ...payload, id: payload._id || payload.id };
      }
    );
  },
});

export const selectUsers = (state: RootState) => state.user.users;
export const selectUser = (id: string) => (state: RootState) =>
  state.user.users.find((_user) => _user.id === id);

export default userSlice.reducer;
