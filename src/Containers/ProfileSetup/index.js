import React from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  Animated,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import {navigateAndSimpleReset} from '@/Navigators/Root';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import UpdateUser from '@/Store/User/UpdateUser';
import {useTheme} from '@/Theme';
import {useTranslation} from 'react-i18next';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Icon, Button, Input} from '@ui-kitten/components';
import Ripple from 'react-native-material-ripple';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {navigate} from '../../Navigators/Root';
import firestore from '@react-native-firebase/firestore';
// import Animated from 'react-native-reanimated';
const ProfileSetupContainer = (props) => {
  const {t} = useTranslation();
  const {Layout, Images} = useTheme();
  const imageanim = new Animated.Value(1);
  const user = auth().currentUser;
  const [name, setName] = React.useState(user.displayName);
  const [bio, setBio] = React.useState(props.user?.about);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState('Continue');
  const [image, setImage] = React.useState(
    user.photoURL ? user.photoURL : null,
  );
  React.useEffect(() => {
    (async () => {
      if (user.photoURL) {
        const url = await storage().ref(user.photoURL).getDownloadURL();
        if (url) {
          setImage(url);
        }
      }
    })();
    return () => {};
  }, [user, setImage]);
  const saveToFirestore = async (data) => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .update(data)
      .catch(async () => {
        await firestore().collection('users').doc(user.uid).set(data);
      });
  };
  const saveProfile = async () => {
    setLoading(true);
    if (
      image &&
      image != user.photoURL &&
      !image.includes('https://firebasestorage.googleapis.com')
    ) {
      const reference = storage().ref('user/' + user.uid + '/profile.png');
      const task = reference.putFile(image);
      task.on('state_changed', async (taskSnapshot) => {
        if (taskSnapshot.state === 'running') {
          setProgress(
            'Uploading Image ' +
              parseFloat(
                (taskSnapshot.bytesTransferred / Math.pow(1024, 2)).toFixed(2),
              ) +
              'MB / ' +
              parseFloat(
                (taskSnapshot.totalBytes / Math.pow(1024, 2)).toFixed(2),
              ) +
              'MB',
          );
        } else if (taskSnapshot.state !== 'success') {
          setLoading(false);
          setProgress('Continue');
          ToastAndroid.show('Failed to Upload Image!', ToastAndroid.SHORT);
        }
      });

      task.then(async () => {
        setProgress('Saving Profile');
        const update = {
          displayName: name,
          photoURL: 'user/' + user.uid + '/profile.png',
        };
        await saveToFirestore({
          uid: user.uid,
          displayName: name,
          photoURL: 'user/' + user.uid + '/profile.png',
          mobile: user.phoneNumber,
          about: bio,
          active: true,
          lastActive: new Date().getTime(),
        });
        await auth().currentUser.updateProfile(update);
        if (props?.route?.params?.reset) navigate('Main');
        else navigateAndSimpleReset('Main');
      });
    } else {
      setProgress('Saving Profile');
      const update = {
        displayName: name,
      };
      await saveToFirestore({
        uid: user.uid,
        displayName: name,
        photoURL: 'user/' + user.uid + '/profile.png',
        mobile: user.phoneNumber,
        about: bio,
        active: true,
        lastActive: new Date().getTime(),
      });
      await auth().currentUser.updateProfile(update);
      if (props?.route?.params?.reset) navigate('Main');
      else navigateAndSimpleReset('Main');
    }
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
              !loading &&
                launchImageLibrary({mediaType: 'photo'}, (e) => {
                  setImage(e.uri);
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
                  source={image ? {uri: image} : Images.user}
                  style={{height: 195, width: 195, borderRadius: 500}}
                  resizeMode="cover"
                />
              </Animated.View>
            </View>
            {!loading && (
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
            )}
          </TouchableWithoutFeedback>
        </Animated.View>

        <Input
          style={{
            fontSize: 20,
            paddingBottom: 2,
            borderBottomWidth: 2,
            textAlign: 'center',
            minWidth: 200,
            margin: 50,
            marginBottom: 5,
            borderColor: '#a9a9a9',
            maxHeight: 100,
          }}
          value={bio}
          disabled={loading}
          multiline
          onChangeText={setBio}
          placeholder="Enter About you..."
        />
        <Input
          style={{
            fontSize: 20,
            paddingBottom: 2,
            borderBottomWidth: 2,
            textAlign: 'center',
            minWidth: 200,
            margin: 50,
            marginTop: 0,
            marginBottom: 5,
            borderColor: '#a9a9a9',
          }}
          value={name}
          onChangeText={setName}
          disabled={loading}
          placeholder="Enter your Name here"
          onSubmitEditing={saveProfile}
        />
        <Button
          disabled={loading}
          onPress={loading ? () => {} : saveProfile}
          style={{
            minWidth: 200,
            marginTop: 70,
            maxWidth: Dimensions.get('window').width - 50,
          }}>
          {t(progress)}
        </Button>
      </View>
    </ApplicationProvider>
  );
};

function mapStateToProps(state) {
  const {user} = state;
  return {user: user.user};
}
export default connect(mapStateToProps)(ProfileSetupContainer);
