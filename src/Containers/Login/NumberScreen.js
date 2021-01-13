import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {Brand} from '@/Components';
import {Button, Input} from '@ui-kitten/components';
import Animated from 'react-native-reanimated';

const NumberScreen = ({
  sendotp,
  numberanim,
  number,
  setNumber,
  errornumber,
  setErrorNumber,
}) => {
  const {Layout, Gutters, Fonts} = useTheme();
  const {t} = useTranslation();

  return (
    <Animated.View
      style={[
        Layout.fill,
        Layout.colVCenter,
        {
          transform: [
            {
              scale: numberanim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            },
          ],
          opacity: numberanim,
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
              maxWidth: 300,
              textAlign: 'center',
              color: '#a9a9a9',
            })
          }>
          {t('We will send you an')}
          <Text style={{color: '#000'}}>{t(' One Time Password')}</Text>
          {t(' on this mobile')}
        </Text>
        <Text
          style={
            (Fonts.textCenter,
            {
              fontSize: 18,
              marginTop: 70,
              maxWidth: 300,
              textAlign: 'center',
              color: '#a9a9a9',
            })
          }>
          {t('Enter Mobile Number')}
        </Text>
        <Input
          returnKeyType="next"
          keyboardType="phone-pad"
          placeholder="00000 00000"
          textAlign="center"
          onChangeText={(value) => {
            setNumber(value);
            setErrorNumber(false);
          }}
          value={number}
          style={{
            fontSize: 20,
            paddingBottom: 0,
            width: 200,
            textAlign: 'center',
            marginTop: 10,
          }}
          onSubmitEditing={sendotp}
          maxLength={10}
          status={errornumber ? 'danger' : 'primary'}
          caption={errornumber ? 'Please Enter Mobile Number' : ''}
        />
        <Button style={{width: 200, marginTop: 50}} onPress={sendotp}>
          {t('Get OTP')}
        </Button>
      </View>
    </Animated.View>
  );
};

export default NumberScreen;
