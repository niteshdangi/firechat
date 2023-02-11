import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper';
import UpdateMessages from './UpdateMessages';

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
  list: [],
};

export default buildSlice('messages', [UpdateMessages], sliceInitialState)
  .reducer;
