import {createAction} from '@reduxjs/toolkit';

export default {
  initialState: {},
  action: createAction('user/setDefaultUser'),
  reducers(state, {payload}) {
    if (payload.user) {
      state.current = payload.user;
    }
    if (payload.list) {
      state.list = payload.list;
    }
  },
};
