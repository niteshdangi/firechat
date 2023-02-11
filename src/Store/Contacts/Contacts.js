import {createAction} from '@reduxjs/toolkit';

export default {
  initialState: {},
  action: createAction('contacts/addcontacts'),
  reducers(state, {payload}) {
    if (payload) {
      state.list = payload;
    }
  },
};
