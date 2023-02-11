import {createAction} from '@reduxjs/toolkit';

export default {
  initialState: {},
  action: createAction('image/firebaseImages'),
  reducers(state, {payload}) {
    if (payload) {
      state.images = {
        ...state.images,
        [payload.url]: payload.firebase,
      };
    }
  },
};
