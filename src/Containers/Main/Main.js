import {Button, Icon, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {
  Image,
  Animated,
  TextInput,
  Dimensions,
  View,
  ScrollView,
  Keyboard,
  BackHandler,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {ChatItem} from '@/Components';
import StoryList from './StoryList';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Options from './Options';
import ChatScreen from './ChatScreen';
import ProfileImage from './ProfileImage';
import Profile from './Profile';
class Main extends React.PureComponent {
  state = {options: null, chat: null, profile: null};
  profileimage = new Animated.Value(1);
  searchAnim = new Animated.Value(0);
  scrollAnim = new Animated.Value(0);
  searchActive = false;
  searchbar = React.createRef();
  scrollContainer = React.createRef();
  searchvalue = '';
  chatScrolled = false;
  scrollOffset = 0;
  chatPan = React.createRef();
  profileRef = React.createRef();
  optionsRef = React.createRef();
  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction.bind(this),
    );
  }
  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    this.backhandler.remove();
  }
  backAction() {
    if (this.state.options !== null) {
      this.optionsRef.current?.hide();
      return true;
    } else if (this.state.profile !== null) {
      this.profileRef.current?.hide();
      return true;
    } else if (this.state.chat !== null) {
      this.chatPan.current?.hide();
      return true;
    }
    return false;
  }
  _keyboardDidShow = () => {
    if (this.searchbar.current.isFocused()) {
      this.searchActive = true;
      this.scrollContainer.current.scrollTo({y: 0, animated: true});
      Animated.spring(this.searchAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  _keyboardDidHide = () => {
    if (this.searchActive && this.searchvalue == '') {
      this.searchActive = false;
      this.scrollContainer.current.scrollTo({y: 0, animated: true});
      Animated.spring(this.searchAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };
  cancelSearch = () => {
    this.searchvalue = '';
    this.searchbar.current.clear();
    this.searchbar.current.blur();
  };
  openSearch = () => {
    this.scrollContainer.current.scrollTo({y: 0, animated: true});
    this.searchbar.current.focus();
  };
  openOptions(data) {
    this.setState({options: data});
  }
  render() {
    const {theme, state, t} = this.props;
    return (
      <Layout style={[theme.Layout.transparent]}>
        <Animated.View
          style={{
            opacity: this.searchAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0, 0],
            }),
            transform: [
              {
                translateY: this.searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -100],
                }),
              },
            ],
          }}>
          <Layout
            style={[
              this.props.theme.Layout.transparent,
              {
                padding: 10,
                paddingHorizontal: 25,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              },
            ]}>
            <Text
              style={{
                color: theme.Colors.text,
                fontSize: 40,
                fontWeight: 'bold',
              }}>
              FireChat
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: this.scrollAnim.interpolate({
                        inputRange: [0, 100, 210],
                        outputRange: [50, 0, 0],
                      }),
                    },
                  ],
                  opacity: this.scrollAnim.interpolate({
                    inputRange: [0, 100, 110],
                    outputRange: [0, 1, 1],
                  }),
                }}>
                <Ripple style={{marginRight: 10}} onPress={this.openSearch}>
                  <Icon
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: theme.Colors.text,
                    }}
                    name="search-outline"
                  />
                </Ripple>
              </Animated.View>
              <Animated.View style={{transform: [{scale: this.profileimage}]}}>
                <Button
                  size="large"
                  appearance="ghost"
                  onPressIn={() => {
                    Animated.spring(this.profileimage, {
                      toValue: 1.2,
                      useNativeDriver: true,
                    }).start();
                  }}
                  onPressOut={() => {
                    Animated.spring(this.profileimage, {
                      toValue: 1,
                      useNativeDriver: true,
                    }).start();
                  }}
                  style={{
                    padding: 0,
                    margin: 0,
                    width: 30,
                    height: 30,
                    marginRight: -20,
                  }}
                  accessoryRight={() => (
                    <Image
                      source={
                        state.user.current.image
                          ? state.user.current.image
                          : theme.Images.logo
                      }
                      style={{width: 40, height: 40, borderRadius: 5}}
                    />
                  )}
                />
              </Animated.View>
            </View>
          </Layout>
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this.searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
              {
                translateX: this.searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          }}>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: this.scrollAnim.interpolate({
                    inputRange: [0, 100, 210],
                    outputRange: [0, -20, -2000],
                  }),
                },
              ],
              opacity: this.scrollAnim.interpolate({
                inputRange: [0, 100, 110],
                outputRange: [1, 0.1, 0],
              }),
            }}>
            <Layout
              style={[
                this.props.theme.Layout.transparent,
                theme.Layout.colCenter,
                {marginTop: 20},
              ]}>
              <View style={{position: 'absolute', elevation: 1, left: 40}}>
                <Icon
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: theme.Colors.placeholder,
                  }}
                  name="search-outline"
                />
              </View>

              <TextInput
                ref={this.searchbar}
                placeholder="Search"
                onChangeText={(value) => (this.searchvalue = value)}
                style={{
                  width: Dimensions.get('window').width - 50,
                  backgroundColor: theme.Colors.inputBackground,
                  borderRadius: 40,
                  paddingLeft: 50,
                  fontSize: 25,
                  paddingVertical: 10,
                }}
              />
              <Animated.View
                style={{
                  position: 'absolute',
                  elevation: 1,
                  right: -15,
                  opacity: this.searchAnim,
                }}>
                <Ripple onPress={this.cancelSearch}>
                  <Icon
                    style={{
                      width: 35,
                      height: 35,
                      tintColor: theme.Colors.placeholder,
                    }}
                    name="close-outline"
                  />
                </Ripple>
              </Animated.View>
            </Layout>
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this.searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
            ],
          }}>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: this.scrollAnim.interpolate({
                    inputRange: [0, 200, 210],
                    outputRange: [0, -120, -120],
                  }),
                },
              ],
            }}>
            <StoryList
              theme={theme}
              state={state}
              t={t}
              scrollAnim={this.scrollAnim}
            />
            <View
              style={{
                width: '100%',
                borderWidth: 0.5,
                borderColor: theme.Colors.placeholder,
                marginVertical: 10,
              }}
            />
            <ScrollView
              ref={this.scrollContainer}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                if (!this.searchActive) {
                  var scrollDirection =
                    e.nativeEvent.contentOffset.y > this.scrollOffset
                      ? 'down'
                      : 'up';
                  this.scrollOffset = e.nativeEvent.contentOffset.y;
                  if (scrollDirection == 'up') {
                    if (e.nativeEvent.contentOffset.y < 200) {
                      this.scrollContainer.current.scrollTo({
                        y: 0,
                        animated: true,
                      });
                    }
                  } else {
                    if (e.nativeEvent.contentOffset.y < 200) {
                      this.scrollContainer.current.scrollTo({
                        y: 200,
                        animated: true,
                      });
                    }
                  }
                }
              }}
              onScroll={(e) => {
                if (!this.searchActive) {
                  this.scrollAnim.stopAnimation();
                  Animated.timing(this.scrollAnim, {
                    toValue: e.nativeEvent.contentOffset.y,
                    useNativeDriver: true,
                    duration: 1,
                  }).start();
                }
              }}
              overScrollMode="always">
              <ChatItem
                openChat={() => {
                  this.setState({chat: true});
                  setTimeout(() => {
                    this.chatPan.current.show();
                  }, 100);
                }}
                options={this.openOptions.bind(this)}
                theme={theme}
                optionsData={this.state.options}
                openProfile={(data) => {
                  this.setState({profile: data});
                }}
                data={{
                  user: {
                    ...state.user.current,
                    active: true,
                    lastseen: '',
                    id: 1,
                  },
                  message: {
                    text: 'Lorem Ipsum',
                    time: 'Yesterday',
                  },
                }}
              />
              <ChatItem
                options={this.openOptions.bind(this)}
                optionsData={this.state.options}
                theme={theme}
                openProfile={(data) => {
                  this.setState({profile: data});
                }}
                openChat={() => {
                  this.setState({chat: true});
                  setTimeout(() => {
                    this.chatPan.current.show();
                  }, 100);
                }}
                data={{
                  user: {
                    ...state.user.current,
                    active: false,
                    lastseen: 'yesterday',
                    id: 2,
                  },
                  message: {
                    text: 'Lorem Ipsum',
                    time: 'Yesterday',
                  },
                }}
              />
              <View style={{height: Dimensions.get('screen').height * 1.5}} />
            </ScrollView>
          </Animated.View>
        </Animated.View>
        {this.state.chat != null && (
          <ChatScreen
            close={() => {
              this.setState({chat: null});
            }}
            openProfile={() => {
              this.setState({
                profile: {
                  data: {
                    user: {
                      ...state.user.current,
                      active: false,
                      lastseen: 'yesterday',
                    },
                  },
                },
              });
            }}
            theme={theme}
            pan={this.chatPan}
            ref={this.chatPan}
            closeOptions={() => this.setState({options: null})}
            data={{
              user: {
                ...state.user.current,
                active: false,
                lastseen: 'yesterday',
              },
              message: {
                text: 'Lorem Ipsum',
                time: 'Yesterday',
              },
            }}
          />
        )}
        {this.state.options != null && (
          <ProfileImage
            ref={this.optionsRef}
            options={this.state.options}
            theme={theme}
            close={() => {
              this.setState({options: null});
            }}
            openChat={() => {
              this.chatPan.current.show();
            }}
          />
        )}
        {this.state.profile !== null && (
          <Profile
            ref={this.profileRef}
            theme={theme}
            close={() => {
              this.setState({profile: null});
            }}
            data={this.state.profile}
          />
        )}
      </Layout>
    );
  }
}
export default Main;
