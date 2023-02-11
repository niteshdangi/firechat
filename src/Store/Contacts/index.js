import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper';
import Contacts from './Contacts';

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
  list: [],
};

export default buildSlice('messages', [Contacts], sliceInitialState).reducer;
