import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper';
import DefaultUser from '@/Store/User/DefaultUser';
import {navigateAndSimpleReset} from '@/Navigators/Root';
import DefaultTheme from '@/Store/Theme/DefaultTheme';
import ChangeTheme from '@/Store/Theme/ChangeTheme';
import {Appearance} from 'react-native';

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (user, {dispatch}) => {
    var cuser = user.current;
    if (user.list.length > 0 && user.current == {}) {
      await dispatch(DefaultUser.action({user: user.list[0]}));
      cuser = user.list[0];
    } else if (user.list.length == 0 && user.current != {}) {
      await dispatch(DefaultUser.action({list: user.current}));
    }
    if (cuser) {
      //validate token
    }
    await dispatch(
      DefaultTheme.action({
        theme: 'default',
        darkMode: false,
      }),
    );
    if (!cuser) {
      navigateAndSimpleReset('Login');
    } else {
      if (!cuser.setup) navigateAndSimpleReset('ProfileSetup');
      else navigateAndSimpleReset('Main');
    }
  }),
  reducers: buildAsyncReducers({itemKey: null}), // We do not want to modify some item by default
};
