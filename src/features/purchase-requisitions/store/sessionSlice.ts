import { createSlice } from '@reduxjs/toolkit';
import { USERS } from '../constants';

const sessionSlice = createSlice({
  name: 'session',
  initialState: { user: { id: USERS[0].id, name: USERS[0].name } },
  reducers: {},
});

export default sessionSlice.reducer;
