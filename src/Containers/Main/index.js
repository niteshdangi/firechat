import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
  StatusBar,
} from 'react-native';
import {useTheme} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {ApplicationProvider, Layout as Layoutt} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Main from './Main';

const MainContainer = () => {
  const {t} = useTranslation();
  const Theme = useTheme();

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layoutt
        style={[
          {
            paddingTop: StatusBar.currentHeight,
            backgroundColor: Theme.Colors.background,
          },
        ]}>
        <Main theme={Theme} t={t} />
      </Layoutt>
    </ApplicationProvider>
  );
};

export default MainContainer;
