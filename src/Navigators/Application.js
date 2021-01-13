import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  IndexStartupContainer,
  LoginContainer,
  ProfileSetupContainer,
} from '@/Containers';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '@/Navigators/Root';
import {Dimensions, SafeAreaView, StatusBar, View} from 'react-native';
import {useTheme} from '@/Theme';
import {AppearanceProvider} from 'react-native-appearance';
const Stack = createStackNavigator();

let MainNavigator;

// @refresh reset
const ApplicationNavigator = () => {
  const {Layout, darkMode, NavigationTheme} = useTheme();
  const {colors} = NavigationTheme;
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false);
  const applicationIsLoading = useSelector((state) => state.startup.loading);
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setTranslucent(true);
  useEffect(() => {
    if (MainNavigator == null && !applicationIsLoading) {
      MainNavigator = require('@/Navigators/Main').default;
      setIsApplicationLoaded(true);
    }
  }, [applicationIsLoading]);

  // on destroy needed to be able to reset when app close in background (Android)
  useEffect(
    () => () => {
      setIsApplicationLoaded(false);
      MainNavigator = null;
    },
    [],
  );
  return (
    <View style={[Layout.fill, {backgroundColor: colors.card}]}>
      <AppearanceProvider>
        <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="Startup" component={IndexStartupContainer} />
            <Stack.Screen name="Login" component={LoginContainer} />
            <Stack.Screen
              name="ProfileSetup"
              component={ProfileSetupContainer}
            />

            {isApplicationLoaded && MainNavigator != null && (
              <Stack.Screen
                name="Main"
                component={MainNavigator}
                options={{
                  animationEnabled: false,
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AppearanceProvider>
    </View>
  );
};

export default ApplicationNavigator;
