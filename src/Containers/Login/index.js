import React, {useEffect} from 'react';
import {navigateAndSimpleReset} from '@/Navigators/Root';
import {
  ActivityIndicator,
  View,
  Text,
  Image,
  Dimensions,
  BackHandler,
} from 'react-native';
import {useTheme} from '@/Theme';
import {useDispatch, useSelector} from 'react-redux';
import DefaultUser from '@/Store/User/DefaultUser';
import {useTranslation} from 'react-i18next';
import {Brand} from '@/Components';
import {
  ApplicationProvider,
  Button,
  Input,
  Layout as Layoutt,
} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Animated, {Easing} from 'react-native-reanimated';
import NumberScreen from './NumberScreen';
import OtpScreen from './OtpScreen';

const numberanim = new Animated.Value(0);
const otpanim = new Animated.Value(0);
const loadinganim = new Animated.Value(0);
const LoginContainer = () => {
  const {Layout, Images} = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [otpscreen, setOtpScreen] = React.useState(false);
  const [number, setNumber] = React.useState('');
  const [errornumber, setErrorNumber] = React.useState(false);
  const [otp, setotp] = React.useState('');
  const [errorotp, setErrorotp] = React.useState(false);
  // const {t} = useTranslation();
  useEffect(() => {
    Animated.timing(numberanim, {
      toValue: otpscreen ? 0 : loading ? 0 : 1,
      duration: 200,
      easing: Easing.ease,
    }).start();
    Animated.timing(otpanim, {
      toValue: otpscreen ? (loading ? 0 : 1) : 0,
      duration: 200,
      easing: Easing.ease,
    }).start();
    Animated.timing(loadinganim, {
      toValue: loading ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
    }).start();
    const backAction = () => {
      if (otpscreen) {
        Animated.timing(numberanim, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
        }).start();
        Animated.timing(otpanim, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
        }).start();
        setTimeout(() => setOtpScreen(false), 200);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [numberanim, otpanim, loadinganim, otpscreen, loading]);
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);
  const sendotp = () => {
    if (number.length !== 10) setErrorNumber(true);
    else {
      setLoading(true);
      setTimeout(() => {
        Animated.timing(numberanim, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
        }).start();
        Animated.timing(loadinganim, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
        }).start();
      }, 100);
      setTimeout(() => {
        setOtpScreen(true);
        setTimeout(() => {
          Animated.timing(otpanim, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
          }).start();
          Animated.timing(loadinganim, {
            toValue: 0,
            duration: 200,
            easing: Easing.ease,
          }).start();
          setTimeout(() => setLoading(false), 200);
        }, 100);
      }, 1000);
    }
  };
  const verifyotp = async (value = otp) => {
    if (value.length !== 4) value = otp;
    if (value.length !== 4) setErrorotp(true);
    else {
      setErrorotp(false);
      setLoading(true);
      const user = {
        mobile: number,
        name: '',
        image: '',
        setup: false,
      };
      await dispatch(DefaultUser.action({user, list: [user]}));
      setLoading(false);
      navigateAndSimpleReset('ProfileSetup');
    }
  };
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NumberScreen
        sendotp={sendotp}
        numberanim={numberanim}
        number={number}
        setErrorNumber={setErrorNumber}
        setNumber={setNumber}
        errornumber={errornumber}
      />

      {otpscreen && (
        <OtpScreen
          verifyotp={verifyotp}
          otpanim={otpanim}
          otp={otp}
          setErrorotp={setErrorotp}
          setotp={setotp}
          errorotp={errorotp}
          number={number}
        />
      )}

      {loading && (
        <Animated.View
          style={[
            Layout.fill,
            Layout.colCenter,
            {
              transform: [
                {
                  scale: loadinganim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
              opacity: loadinganim,
              position: 'absolute',
              width: '100%',
              height: '100%',
            },
          ]}>
          <View style={[Layout.fill, Layout.colCenter]}>
            <View style={{height: 200, width: 200}}>
              <Image
                style={Layout.fullSize}
                source={Images.loading}
                resizeMode="contain"
              />
            </View>
          </View>
        </Animated.View>
      )}
      <Layoutt
        style={{
          position: 'absolute',
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').width,
          marginTop:
            Dimensions.get('screen').height - Dimensions.get('screen').width,
          zIndex: -1,
          backgroundColor: 'transparent',
          opacity: 0.2,
        }}>
        <Image
          style={[Layout.fullSize]}
          source={Images.bg}
          resizeMode="cover"
        />
      </Layoutt>
    </ApplicationProvider>
  );
};

export default LoginContainer;
