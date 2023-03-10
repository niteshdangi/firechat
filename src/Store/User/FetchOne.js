import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper';
import fetchOneUserService from '@/Services/User/FetchOne';

export default {
  initialState: buildAsyncState('fetchOne'),
  action: buildAsyncActions('user/fetchOne', fetchOneUserService),
  reducers: buildAsyncReducers({
    errorKey: 'fetchOne.error',
    loadingKey: 'fetchOne.loading',
  }),
};
