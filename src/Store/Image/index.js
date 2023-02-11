import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper';
import Firebase from './Firebase';

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
  images: {},
};

export default buildSlice('image', [Firebase], sliceInitialState).reducer;
