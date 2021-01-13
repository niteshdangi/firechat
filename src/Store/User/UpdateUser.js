import {createAction} from '@reduxjs/toolkit';

export default {
  initialState: {},
  action: createAction('user/updateDefaultUser'),
  reducers(state, {payload}) {
    if (payload.user) {
      state.current = {...state.current, ...payload.user};
      state.list = [
        {...state.current, ...payload.user},
        ...state.list.slice(1, state.list.length - 1),
      ];
    }
  },
};
