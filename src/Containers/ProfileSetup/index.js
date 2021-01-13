import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import {navigateAndSimpleReset} from '@/Navigators/Root';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import UpdateUser from '@/Store/User/UpdateUser';
import {useTheme} from '@/Theme';
import {useTranslation} from 'react-i18next';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Icon, Button} from '@ui-kitten/components';
import Ripple from 'react-native-material-ripple';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
// import Animated from 'react-native-reanimated';
const ProfileSetupContainer = () => {
  const {t} = useTranslation();
  const {Common, Fonts, Gutters, Layout, Images} = useTheme();
  const dispatch = useDispatch();
  const imageanim = new Animated.Value(1);
  const user = useSelector((state) => state.user);
  const [name, setName] = React.useState(user.current.name);
  const [image, setImage] = React.useState(
    user.current.image ? user.current.image : Images.user,
  );
  React.useEffect(() => {
    if (user.current) {
      if (user.current.setup) navigateAndSimpleReset('Main');
    }
  }, [user]);
  const saveProfile = async () => {
    const newuser = {name, image, setup: true};
    await dispatch(UpdateUser.action({user: newuser}));
    navigateAndSimpleReset('Main');
  };
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={[Layout.fill, Layout.colVCenter]}>
        <Animated.View
          style={{
            transform: [
              {
                scale: imageanim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              launchImageLibrary({mediaType: 'photo'}, (e) => {
                setImage({uri: e.uri});
              });
            }}
            onPressIn={() => {
              Animated.spring(imageanim, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              Animated.spring(imageanim, {
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
            style={{elevation: 3, marginTop: 100, borderRadius: 500}}>
            <View
              style={{
                borderRadius: 500,
                borderWidth: 5,
                height: 205,
                width: 205,
                elevation: 2,
                backgroundColor: '#fff',
                borderColor: 'orange',
                overflow: 'hidden',
              }}>
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: imageanim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1.1, 1],
                      }),
                    },
                  ],
                }}>
                <Image
                  source={image}
                  style={{height: 195, width: 195, borderRadius: 500}}
                  resizeMode="cover"
                />
              </Animated.View>
            </View>
            <Ripple
              style={{
                position: 'absolute',
                elevation: 5,
                right: 0,
                backgroundColor: 'orange',
                borderRadius: 100,
                padding: 10,
                bottom: 0,
              }}>
              <Icon
                name="camera-outline"
                style={{width: 40, height: 40, tintColor: '#fff'}}
              />
            </Ripple>
          </TouchableWithoutFeedback>
        </Animated.View>
        <TextInput
          style={{
            fontSize: 20,
            paddingBottom: 2,
            borderBottomWidth: 2,
            marginTop: 50,
            textAlign: 'center',
            minWidth: 200,
            borderColor: '#a9a9a9',
          }}
          value={name}
          onChangeText={setName}
          placeholder="Enter your Name here"
          onSubmitEditing={saveProfile}
        />
        <Button onPress={saveProfile} style={{width: 200, marginTop: 70}}>
          {t('Continue')}
        </Button>
      </View>
    </ApplicationProvider>
  );
};
export default ProfileSetupContainer;
