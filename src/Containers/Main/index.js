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
import ChangeTheme from '@/Store/Theme/ChangeTheme';
import {ApplicationProvider, Layout as Layoutt} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Main from './Main';

const MainContainer = () => {
  const {t} = useTranslation();
  const Theme = useTheme();
  const dispatch = useDispatch();

  const _state = useSelector((state) => state);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layoutt
        style={[
          Theme.Layout.transparent,
          {paddingTop: StatusBar.currentHeight},
        ]}>
        <Main theme={Theme} t={t} dispatch={dispatch} state={_state} />
      </Layoutt>
    </ApplicationProvider>
  );
};

export default MainContainer;
