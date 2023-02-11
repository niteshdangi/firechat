import {Button, Icon, Text} from '@ui-kitten/components';
import React, {Component, PureComponent} from 'react';
import {Animated, Dimensions, View, Image, ToastAndroid} from 'react-native';
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import UpdateUser from '@/Store/User/UpdateUser';
import auth from '@react-native-firebase/auth';
import {getLastActive} from '../../Components/ChatItem';

import {useDispatch, useSelector} from 'react-redux';
import StoryList from './StoryList';
import {navigate} from '../../Navigators/Root';
import FirebaseImage from '../../Components/FirebaseImage';
export default class Profile extends Component {
  anim = new Animated.Value(0);
  pan = new Animated.Value(0);
  hide() {
    Animated.spring(this.pan, {toValue: 0, useNativeDriver: true}).start();

    Animated.spring(this.anim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setTimeout(this.props.close, 100);
  }
  shouldComponentUpdate(p, s) {
    return p !== this.props;
  }
  render() {
    const {theme, data} = this.props;
    const profile = data.data;
    const self = profile.uid == auth().currentUser.uid;
    Animated.timing(this.anim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 1,
    }).start();
    Animated.spring(this.anim, {
      toValue: 1,
      useNativeDriver: true,
      delay: 10,
    }).start();
    // const {py, px, data} = options;
    var outputRangeWidth = [0.14, 1];
    var outputRangeHeight = [0.14, 1];
    var outputRangeRadius = [Dimensions.get('window').width, 0, 0];
    var outputRangeTop = [-Dimensions.get('window').width / 2 + 40, 0];
    var outputRangeLeft = [-Dimensions.get('window').width / 2 + 54, 0];
    var outputRangeWidthName = [0.65, 1];
    var outputRangeHeightName = [0.65, 1];
    var outputRangeTopName = [-Dimensions.get('window').width + 70, 0];
    var outputRangeLeftName = [15, 0];
    var outputRangeOpacityOnline = [1, 1];
    if (data?.from) {
      outputRangeWidth = data.from == 'header' ? [0.13, 1] : [0.18, 1];
      outputRangeHeight = data.from == 'header' ? [0.13, 1] : [0.18, 1];
      outputRangeRadius =
        data.from == 'header'
          ? [50, 0, 0]
          : [Dimensions.get('window').width, 0, 0];
      outputRangeTop = [data.py - Dimensions.get('window').width / 2 + 5, 0];
      outputRangeLeft =
        data.from == 'header'
          ? [data.px, 0]
          : [-Dimensions.get('window').width / 2 + 45, 0];
      outputRangeWidthName = [0.64, 1];
      outputRangeHeightName = [0.6, 1];
      outputRangeTopName = [data.py - Dimensions.get('window').width + 32, 0];
      outputRangeLeftName = data.from == 'header' ? [-1000, 0] : [18, 0];
      outputRangeOpacityOnline = [0, 1];
    }
    const width = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeWidth,
    });
    const height = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeHeight,
    });
    const borderRadius = this.anim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: outputRangeRadius,
    });
    const top = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeTop,
    });
    const left = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeLeft,
    });
    const topName = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeTopName,
    });
    const leftName = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeLeftName,
    });
    const widthName = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeWidthName,
    });
    const heightName = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeHeightName,
    });
    const opacityOnline = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeOpacityOnline,
    });

    return (
      <PanGestureHandler
        activeOffsetY={[-5000, 80]}
        onHandlerStateChange={(e) => {
          if (e.nativeEvent.state != State.ACTIVE) {
            if (
              e.nativeEvent.translationY * 0.8 > 100 ||
              (e.nativeEvent.velocityY > 1000 &&
                e.nativeEvent.translationY > 50)
            ) {
              if (
                e.nativeEvent.translationY < 200 &&
                e.nativeEvent.velocityY < 5
              )
                Animated.spring(this.pan, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
              else this.hide();
            } else {
              Animated.spring(this.pan, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          }
        }}
        onGestureEvent={(e) => {
          if (e.nativeEvent.translationY * 0.8 > 0)
            Animated.timing(this.pan, {
              toValue: e.nativeEvent.translationY * 0.5,
              useNativeDriver: true,
              duration: 1,
            }).start();
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: Dimensions.get('screen').height,
            transform: [
              {translateY: this.pan},
              {
                scaleX: this.pan.interpolate({
                  inputRange: [0, Dimensions.get('screen').height],
                  outputRange: [1, 0.3],
                }),
              },
              {
                scaleY: this.pan.interpolate({
                  inputRange: [0, Dimensions.get('screen').height],
                  outputRange: [1, 0],
                }),
              },
            ],
            borderRadius: this.pan.interpolate({
              inputRange: [0, Dimensions.get('screen').height],
              outputRange: [0, Dimensions.get('screen').height],
            }),
            overflow: 'hidden',
          }}>
          <Animated.View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').width,
              borderRadius,
              top: 0,
              left: 0,
              position: 'absolute',
              backgroundColor: theme.Colors.background,
              overflow: 'hidden',
              transform: [
                {translateX: left},
                {translateY: top},
                {scaleX: width},
                {scaleY: height},
              ],
            }}>
            <FirebaseImage
              url={profile.photoURL}
              style={{width: '100%', height: '100%'}}
            />
            {/* {self && ( */}
            {/* <View style={{position: 'absolute', right: 10, top: 10}}>
                
                <UpdateUserBt />
              </View> */}
            {/* )} */}
          </Animated.View>
          <Animated.View
            style={{
              top: Dimensions.get('window').width - 80,
              transform: [
                {translateX: leftName},
                {translateY: topName},
                {scaleX: widthName},
                {scaleY: heightName},
              ],
              backgroundColor: theme.Colors.background,
              marginHorizontal: 20,
              padding: 10,
              borderRadius: 10,
              opacity: 0.8,
            }}>
            <Animated.Text style={{fontSize: 30}}>
              {profile.displayName}
            </Animated.Text>
            <Animated.Text
              style={{fontSize: 20, marginTop: 5, opacity: opacityOnline}}>
              {profile.active
                ? 'Online'
                : getLastActive(new Date(parseInt(profile.lastActive)))}
            </Animated.Text>
          </Animated.View>
          <Animated.ScrollView
            style={{
              backgroundColor: theme.Colors.background,
              top: Dimensions.get('window').width - 74,
              height:
                Dimensions.get('screen').height -
                Dimensions.get('screen').width,
              transform: [
                {
                  translateY: this.anim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [
                      Dimensions.get('screen').height -
                        Dimensions.get('window').width,
                      0,
                      0,
                    ],
                  }),
                },
              ],
              opacity: this.anim,
              borderTopWidth: 2,
              borderTopColor: theme.Colors.placeholder,
            }}
            overScrollMode="always">
            {profile.about !== '' && (
              <View
                style={{
                  padding: 10,
                  paddingHorizontal: 15,
                  borderBottomColor: theme.Colors.placeholder,
                  borderBottomWidth: 1,
                }}>
                <Text style={{fontSize: 20, marginBottom: 5}}>About</Text>
                <Text appearance="hint">{profile.about}</Text>
              </View>
            )}
            <View
              style={{
                borderBottomColor: theme.Colors.placeholder,
                borderBottomWidth: 1,
                paddingVertical: 5,
              }}>
              <StoryList
                theme={theme}
                state={this.props.state}
                t={this.props.t}
                // scrollAnim={this.scrollAnim}
              />
            </View>
            <View
              style={{
                borderBottomColor: theme.Colors.placeholder,
                borderBottomWidth: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {profile.mobile && (
                <>
                  <View style={{padding: 15}}>
                    <Text style={{fontSize: 20, marginBottom: 5}}>
                      Mobile No.
                    </Text>
                    <Text appearance="hint">{profile.mobile}</Text>
                  </View>

                  {!self && (
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Button
                        appearance="ghost"
                        // style={{width: 20, padding: 0, height: 20}}
                        accessoryLeft={(props) => (
                          <Icon
                            name="phone-outline"
                            style={{
                              width: 30,
                              height: 30,
                              tintColor: theme.Colors.primary,
                              marginRight: 3,
                            }}
                          />
                        )}
                      />
                      <Button
                        appearance="ghost"
                        // style={{width: 20, padding: 0, height: 20}}
                        accessoryLeft={(props) => (
                          <Icon
                            name="message-square-outline"
                            style={{
                              width: 30,
                              height: 30,
                              tintColor: theme.Colors.primary,
                              marginRight: 3,
                            }}
                          />
                        )}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
            {!self ? (
              <View>
                <Button
                  appearance="ghost"
                  style={{width: '100%', justifyContent: 'flex-start'}}
                  accessoryLeft={(props) => (
                    <Icon
                      name="trash-outline"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: theme.Colors.text,
                        marginRight: 3,
                      }}
                    />
                  )}>
                  <Text style={{fontSize: 20}}>Clear Chat</Text>
                </Button>
                <Button
                  appearance="ghost"
                  style={{width: '100%', justifyContent: 'flex-start'}}
                  accessoryLeft={(props) => (
                    <Icon
                      name="person-delete-outline"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: theme.Colors.text,
                        marginRight: 3,
                      }}
                    />
                  )}>
                  <Text style={{fontSize: 20}}>Block</Text>
                </Button>
                <Button
                  appearance="ghost"
                  style={{width: '100%', justifyContent: 'flex-start'}}
                  accessoryLeft={(props) => (
                    <Icon
                      name="alert-circle-outline"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: theme.Colors.text,
                        marginRight: 3,
                      }}
                    />
                  )}>
                  <Text style={{fontSize: 20}}>Report</Text>
                </Button>
              </View>
            ) : (
              <View>
                <Button
                  appearance="ghost"
                  onPress={() => {
                    navigate('ProfileSetup', {reset: true});
                  }}
                  style={{width: '100%', justifyContent: 'flex-start'}}
                  accessoryLeft={(props) => (
                    <Icon
                      name="edit-outline"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: theme.Colors.text,
                        marginRight: 3,
                      }}
                    />
                  )}>
                  <Text style={{fontSize: 20}}>Edit Profile</Text>
                </Button>
                <Button
                  appearance="ghost"
                  onPress={() => {
                    ToastAndroid.show(
                      'Privacy Settings are enabled & cannot be changed now',
                      ToastAndroid.LONG,
                    );
                  }}
                  style={{width: '100%', justifyContent: 'flex-start'}}
                  accessoryLeft={(props) => (
                    <Icon
                      name="lock-outline"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: theme.Colors.text,
                        marginRight: 3,
                      }}
                    />
                  )}>
                  <Text style={{fontSize: 20}}>Privacy Settings</Text>
                </Button>
                <Button
                  appearance="ghost"
                  onPress={() => {
                    auth().signOut();
                  }}
                  style={{width: '100%', justifyContent: 'flex-start'}}
                  accessoryLeft={(props) => (
                    <Icon
                      name="log-out-outline"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: theme.Colors.text,
                        marginRight: 3,
                      }}
                    />
                  )}>
                  <Text style={{fontSize: 20}}>Logout</Text>
                </Button>
              </View>
            )}
            <View
              style={{
                borderBottomColor: theme.Colors.placeholder,
                borderBottomWidth: 1,
                height: Dimensions.get('window').height + 200,
              }}></View>
          </Animated.ScrollView>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
// export default connect(null, {UpdateUser, useDispatch})(Profile);
const UpdateUserBt = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  return (
    <Button
      appearance="ghost"
      onPress={() => {
        launchImageLibrary({mediaType: 'photo'}, async (e) => {
          // setImage({uri: e.uri});
          // console.log(this.props?.UpdateUser, this.props?.dispatch);
          await dispatch(
            UpdateUser.action({
              user: {
                ...user.current,
                image: {uri: e.uri},
              },
            }),
          );
        });
      }}
      style={{backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50}}
      accessoryLeft={(props) => (
        <Icon
          name="edit-outline"
          style={{
            width: 30,
            height: 30,
            tintColor: '#a9a9a9',
            marginRight: 3,
          }}
        />
      )}
    />
  );
};
