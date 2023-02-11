import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper';
import DefaultUser from '@/Store/User/DefaultUser';
import {navigateAndSimpleReset} from '@/Navigators/Root';
import DefaultTheme from '@/Store/Theme/DefaultTheme';
import auth from '@react-native-firebase/auth';

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, {dispatch}) => {
    const user = auth().currentUser;
    await dispatch(
      DefaultTheme.action({
        theme: 'default',
        darkMode: false,
      }),
    );
    if (!user) {
      navigateAndSimpleReset('Login');
    } else {
      if (user.displayName == null) navigateAndSimpleReset('ProfileSetup');
      else navigateAndSimpleReset('Main');
    }
  }),
  reducers: buildAsyncReducers({itemKey: null}), // We do not want to modify some item by default
};
