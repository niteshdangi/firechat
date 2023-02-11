import {createAction} from '@reduxjs/toolkit';

export default {
  initialState: {},
  action: createAction('messages/updateMessages'),
  reducers(state, {payload}) {
    if (payload) {
      state.list = payload;
    }
  },
};
