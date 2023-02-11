import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {Brand} from '@/Components';
import {Button, Input} from '@ui-kitten/components';
import Animated from 'react-native-reanimated';
import OtpInput from './OtpInput';

const OtpScreen = ({
  verifyotp,
  otpanim,
  otp,
  setotp,
  errorotp,
  setErrorotp,
  number,
}) => {
  const {Layout, Gutters, Fonts} = useTheme();
  const {t} = useTranslation();
  const _setotp = (value) => {
    setotp(value);
    setErrorotp(false);
    if (value.length == 6) verifyotp(value);
  };
  return (
    <Animated.View
      style={[
        Layout.fill,
        Layout.colVCenter,
        Layout.fullSize,
        {
          transform: [
            {
              scale: otpanim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            },
          ],
          opacity: otpanim,
          position: 'absolute',
        },
      ]}>
      <View style={[Layout.fill, Layout.colVCenter, {marginTop: 50}]}>
        <Brand />
        <Text style={(Fonts.textCenter, {fontSize: 30, fontWeight: 'bold'})}>
          {t('FireChat')}
        </Text>
        <Text
          style={
            (Fonts.textCenter,
            {
              fontSize: 18,
              marginTop: 25,
              marginBottom: 25,
              maxWidth: 300,
              textAlign: 'center',
              color: '#a9a9a9',
            })
          }>
          {t('Enter the OTP sent to ')}
          <Text style={{color: '#000'}}>{t('+91-' + number)}</Text>
        </Text>
        <OtpInput
          onSubmitEditing={verifyotp}
          setOtp={_setotp}
          errorotp={errorotp}
        />
        {errorotp && (
          <Text style={{color: 'red', width: 180, marginTop: 10}}>
            {t('Invalid OTP')}
          </Text>
        )}

        <Text
          style={
            (Fonts.textCenter,
            {
              fontSize: 18,
              marginTop: 35,
              maxWidth: 300,
              textAlign: 'center',
              color: '#a9a9a9',
            })
          }>
          {t("Didn't received OTP? ")}
          <Text style={{color: 'blue'}}>{t('Resend OTP')}</Text>
        </Text>
        <Button style={{width: 200, marginTop: 50}} onPress={verifyotp}>
          {t('Verify OTP')}
        </Button>
      </View>
    </Animated.View>
  );
};

export default OtpScreen;
