import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper';
import DefaultUser from './DefaultUser';
import UpdateUser from './UpdateUser';

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
  current: {
    mobile: 'number',
    name: '',
    image: '',
    setup: false,
  },
  list: [
    {
      mobile: 'number',
      name: '',
      image: '',
      setup: false,
    },
  ],
};

export default buildSlice('user', [DefaultUser, UpdateUser], sliceInitialState)
  .reducer;
