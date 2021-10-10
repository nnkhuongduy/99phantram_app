import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';

interface GlobalState {
  headerTitle: string;
}

const initialState: GlobalState = {
  headerTitle: '',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setHeaderTitle: (state, { payload }: PayloadAction<string>) => {
      state.headerTitle = payload;
    },
  },
});

export const { setHeaderTitle } = globalSlice.actions;

export const selectHeaderTitle = (state: RootState) => state.global.headerTitle;

export default globalSlice.reducer;
