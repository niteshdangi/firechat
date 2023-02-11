import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {store, persistor} from '@/Store';
import {ApplicationNavigator} from '@/Navigators';
import './Translations';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {IconRegistry} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import {navigateAndSimpleReset} from '@/Navigators/Root';

const App = () => {
  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber();
    };
  });
  function onAuthStateChanged(user) {
    if (!user) {
      navigateAndSimpleReset('Login');
    } else {
      if (user.displayName == null) navigateAndSimpleReset('ProfileSetup');
      else navigateAndSimpleReset('Main');
    }
  }
  return (
    <Provider store={store}>
      {/**
       * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
       * and saved to redux.
       * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
       * for example `loading={<SplashScreen />}`.
       * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
       */}
      <IconRegistry icons={EvaIconsPack} />
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
