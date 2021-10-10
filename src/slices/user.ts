import { createSlice } from '@reduxjs/toolkit';
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
        state.users = payload;
      }
    );
  },
});

export default userSlice.reducer;
