import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Appearance,
} from 'react-native';
import {useTheme} from '@/Theme';
import {useDispatch, useSelector} from 'react-redux';
import InitStartup from '@/Store/Startup/Init';
import {useTranslation} from 'react-i18next';
import {Brand} from '@/Components';
import ChangeTheme from '@/Store/Theme/ChangeTheme';

const IndexStartupContainer = () => {
  const {Layout, Gutters, Fonts} = useTheme();

  const {t} = useTranslation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);
  const darktheme = Appearance.getColorScheme() == 'dark';
  dispatch(ChangeTheme.action({darkMode: darktheme}));

  useEffect(() => {
    Appearance.addChangeListener((e) => {
      dispatch(ChangeTheme.action({darkMode: e.colorScheme == 'dark'}));
    });

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]).then((result) => {
        if (
          result['android.permission.READ_CONTACTS'] &&
          result['android.permission.READ_EXTERNAL_STORAGE'] &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          // this.setState({
          //   permissionsGranted: true
          // });
          dispatch(InitStartup.action(user));
        } else if (
          result['android.permission.READ_CONTACTS'] ||
          result['android.permission.READ_EXTERNAL_STORAGE'] ||
          result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            'never_ask_again'
        ) {
          this.refs.toast.show(
            'Please Go into Settings -> Applications -> FireChat -> Permissions and Allow permissions to continue',
          );
        }
      });
    }
    return Appearance.removeChangeListener();
  }, [dispatch, user, theme, Appearance]);

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Brand />
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
    </View>
  );
};

export default IndexStartupContainer;
