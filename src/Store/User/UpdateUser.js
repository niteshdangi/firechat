import {createAction} from '@reduxjs/toolkit';

export default {
  initialState: {},
  action: createAction('user/updateDefaultUser'),
  reducers(state, {payload}) {
    if (payload.user) {
      state.user = payload.user;
    }
  },
};
