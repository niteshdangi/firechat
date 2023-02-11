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
  AppState,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {ChatItem} from '@/Components';
import StoryList from './StoryList';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Options from './Options';
import ChatScreen from './ChatScreen';
import ProfileImage from './ProfileImage';
import Profile from './Profile';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';

import firestore from '@react-native-firebase/firestore';
import FirebaseImage from '../../Components/FirebaseImage';
import {connect} from 'react-redux';
import UpdateMessages from '../../Store/Messages/UpdateMessages';
import UpdateUser from '../../Store/User/UpdateUser';
import ADDContacts from '../../Store/Contacts/Contacts';
import NewMessage from './NewMessage';
class Main extends React.Component {
  state = {
    options: null,
    chat: null,
    profile: null,
    user: auth().currentUser,
    contacts: [],
  };
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
  async getImage(url_, defaulturl = '', withUri = true) {
    try {
      const url = await storage().ref(url_).getDownloadURL();
      console.log(url);
      return withUri ? {uri: url} : url;
    } catch (e) {
      console.log(e);
    }
    return defaulturl;
  }
  searchIdMessages(id) {
    var index_ = null;
    this.props.messages.forEach((value, index) => {
      if (value.id == id) {
        index_ = index;
      }
    });
    return index_;
  }
  formatMessage(data) {
    return {
      id: data.id,
      lastMessage: {
        id: data?.lastMessage?.id,
        text: data?.lastMessage?.text,
        timestamp: data?.lastMessage?.timestamp,
        media: data?.lastMessage?.media,
        gif: data?.lastMessage?.gif,
        sticker: data?.lastMessage?.sticker,
        sid: data?.lastMessage?.sid,
        seen: data?.lastMessage?.seen,
        sent: data?.lastMessage?.sent,
      },
      user: {
        about: data?.user?.about,
        displayName: data?.user?.displayName,
        photoURL: data?.user?.photoURL,
        lastActive: data?.user?.lastActive,
        active: data?.user?.active,
        uid: data?.uid,
        id: data.id,
        mobile: data?.user?.mobile,
      },
      users: data?.users,
    };
  }
  async componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction.bind(this),
    );
    this.user = auth().currentUser;
    firestore().collection('users').doc(this.user.uid).update({
      active: true,
    });
    this.getSuggestions();
    AppState.addEventListener('change', this.handleAppState.bind(this));
    this.usersnapshot = firestore()
      .collection('users')
      .doc(this.user.uid)
      .onSnapshot((usersnapshot) => {
        const data = {
          user: usersnapshot.data(),
          uid: this.user.uid,
        };
        this.props.dispatch(
          UpdateUser.action({
            user: {
              about: data?.user?.about,
              displayName: data?.user?.displayName,
              photoURL: data?.user?.photoURL,
              lastActive: data?.user?.lastActive,
              active: data?.user?.active,
              mobile: data?.user?.mobile,
              uid: data?.uid,
            },
          }),
        );
      });
    this.userStores = [];
    this.userDocument = firestore()
      .collection('messages')
      .where('users', 'array-contains', this.user.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot((documentSnapshot) => {
        documentSnapshot?.docChanges().forEach((value, index) => {
          var user = [...value.doc.data().users];
          if (user.length == 2) {
            if (user[0] == this.user.uid) user = user[1];
            else user = user[0];
          } else if (user.length == 1) {
            user = user[0];
          } else {
            user = this.user.uid;
          }
          value.doc.ref
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .get()
            .then((lastMessage) => {
              const userStore = firestore()
                .collection('users')
                .doc(user)
                .onSnapshot((usersnapshot) => {
                  const messages = [...this.props.messages];
                  if (
                    lastMessage?.docs?.[lastMessage?.docs?.length - 1]?.data()
                  ) {
                    const mid = this.searchIdMessages(value.doc.id);

                    if (mid != null) {
                      messages[mid] = this.formatMessage({
                        id: value.doc.id,
                        ...value.doc.data(),
                        lastMessage: {
                          ...lastMessage?.docs?.[
                            lastMessage?.docs?.length - 1
                          ]?.data(),
                          id:
                            lastMessage?.docs?.[lastMessage?.docs?.length - 1]
                              ?.id,
                        },
                        user: usersnapshot.data(),
                        uid: user,
                      });
                    } else {
                      messages.push(
                        this.formatMessage({
                          id: value.doc.id,
                          ...value.doc.data(),
                          lastMessage: {
                            ...lastMessage?.docs?.[
                              lastMessage?.docs?.length - 1
                            ]?.data(),
                            id:
                              lastMessage?.docs?.[lastMessage?.docs?.length - 1]
                                ?.id,
                          },
                          user: usersnapshot.data(),
                          uid: user,
                        }),
                      );
                    }
                    this.props.dispatch(UpdateMessages.action(messages));
                  }
                });
              this.userStores.push(userStore);
            })
            .catch((e) => {});
        });
      });
  }
  async getSuggestions() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(() =>
      Contacts.getAll().then(async (contacts) => {
        const contactslist_ = [];
        contacts.forEach((contact) => {
          contact.phoneNumbers.forEach((number) => {
            contactslist_.push(
              number.number
                .replace(' ', '')
                .replace(' ', '')
                .replace(' ', '')
                .replace(' ', '')
                .replace('-', ''),
            );
          });
        });
        const contactslist = [];
        contactslist_.forEach((c) => {
          this.props.messages.forEach((us) => {
            if (
              !(
                c == us.user.mobile ||
                us.user.mobile.includes(c) ||
                c.includes(us.user.mobile)
              )
            ) {
              if (!contactslist.includes(c)) {
                contactslist.push(c);
              }
            }
          });
        });
        await firestore()
          .collection('users')
          .get()
          .then((value) => {
            const clist = [];
            value.docs.forEach((us) => {
              contactslist.forEach((contact) => {
                if (
                  contact == us.data().mobile ||
                  us.data().mobile.includes(contact) ||
                  contact.includes(us.data().mobile)
                ) {
                  clist.push(us.data());
                }
              });
            });
            this.setState({contacts: clist});
          });
      }),
    );
  }
  handleAppState(e) {
    if (e == 'active') {
      firestore().collection('users').doc(this.user.uid).update({
        active: true,
      });
    } else if (e !== 'active') {
      firestore().collection('users').doc(this.user.uid).update({
        active: false,
        lastActive: new Date().getTime(),
      });
    }
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppState.bind(this));
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    this.backhandler.remove();
    this.userDocument();
    this.userStores.forEach((value, index) => {
      value();
    });
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
      this.scrollContainer.current?.scrollToOffset({offset: 0, animated: true});
      Animated.spring(this.searchAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  _keyboardDidHide = () => {
    if (this.searchActive && this.searchvalue == '') {
      this.searchActive = false;
      this.scrollContainer.current?.scrollToOffset({offset: 0, animated: true});
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
    this.scrollContainer.current?.scrollToOffset({offset: 0, animated: true});
    this.searchbar.current.focus();
  };
  openOptions(data) {
    this.setState({options: data});
  }
  shouldComponentUpdate(p, s) {
    return p != this.props || s != this.state;
  }
  render() {
    const {theme, t} = this.props;
    const state = {user: {current: {}}};
    return (
      <Layout
        style={{height: '100%', backgroundColor: theme.Colors.background}}>
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
                  onPress={() => {
                    this.setState({
                      profile: {
                        px: Dimensions.get('window').width / 2 - 40,
                        py: 35,
                        from: 'header',
                        data: this.props.user,
                      },
                    });
                  }}
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
                    <FirebaseImage
                      url={this.state.user.photoURL}
                      default={theme.Images.user}
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
              homePage={true}
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
            <FlatList
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
                      this.scrollContainer.current.scrollToOffset({
                        offset: 0,
                        animated: true,
                      });
                    }
                  } else {
                    if (e.nativeEvent.contentOffset.y < 200) {
                      this.scrollContainer.current.scrollToOffset({
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
              overScrollMode="always"
              data={[this.props.messages, this.state.contacts]}
              keyExtractor={(item, index) => index}
              renderItem={(props_) =>
                props_.index == 0 ? (
                  <FlatList
                    data={props_.item}
                    keyExtractor={(item, index) => index}
                    renderItem={(props) => (
                      <ChatItem
                        openChat={(user) => {
                          this.setState({chat: user});
                          setTimeout(() => {
                            this.chatPan.current.show();
                          }, 100);
                        }}
                        self={this.user?.uid}
                        options={this.openOptions.bind(this)}
                        theme={theme}
                        optionsData={this.state.options}
                        openProfile={(data) => {
                          this.setState({profile: data});
                        }}
                        data={props.item}
                      />
                    )}
                  />
                ) : (
                  <FlatList
                    data={props_.item}
                    keyExtractor={(item, index) => index}
                    renderItem={(props) => (
                      <NewMessage
                        theme={theme}
                        options={this.openOptions.bind(this)}
                        optionsData={this.state.options}
                        openProfile={(data) => {
                          this.setState({profile: data});
                        }}
                        openChat={(user) => {
                          const clist = [];
                          this.state.contacts.forEach((element) => {
                            if (element.uid !== user.uid) {
                              clist.push(element);
                            }
                          });
                          this.setState({contacts: clist});
                        }}
                        uid={this.user.uid}
                        data={props.item}
                      />
                    )}
                  />
                )
              }
            />
          </Animated.View>
        </Animated.View>
        {this.state.chat != null && (
          <ChatScreen
            close={() => {
              this.setState({chat: null});
            }}
            openProfile={(user) => {
              this.setState({
                profile: user,
              });
            }}
            theme={theme}
            user={this.props.user}
            pan={this.chatPan}
            ref={this.chatPan}
            closeOptions={() => this.setState({options: null})}
            data={this.state.chat}
          />
        )}
        {this.state.options != null && (
          <ProfileImage
            // dispatch={this.props.dispatch}
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
            state={state}
            t={t}
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

function mapStateToProps(state) {
  const {messages, user, contacts} = state;
  return {messages: messages.list, user: user.user, contacts: contacts.list};
}
export default connect(mapStateToProps)(Main);
