import {Button, Icon, Input, Layout, Text} from '@ui-kitten/components';
import React, {Component, PureComponent} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  StatusBar,
  View,
} from 'react-native';
import {
  FlatList,
  PanGestureHandler,
  ScrollView,
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import FirebaseImage from '../../Components/FirebaseImage';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatOptions from './ChatOptions';
import Giphy from './Giphy';
import {getLastActive} from '../../Components/ChatItem';
import firestore from '@react-native-firebase/firestore';
class ChatScreen extends Component {
  state = {
    messageOptions: null,
    messages: [],
    user: this.props.data,
    reply: null,
  };
  pan = new Animated.Value(0);
  openProfile = new Animated.Value(0);
  profileImage = new Animated.Value(0);
  keyboardanim = new Animated.Value(0);
  chatHistoryRef = React.createRef();
  chatscrollview = React.createRef();
  giphyModal = React.createRef();
  keyboardOpen = false;
  show() {
    Animated.timing(this.pan, {
      toValue: Dimensions.get('window').width,
      useNativeDriver: true,
      duration: 500,
    }).start();
    Animated.timing(this.profileImage, {
      toValue: 1,
      useNativeDriver: true,
      duration: 150,
      delay: 700,
    }).start();
    setTimeout(() => {
      this.props.closeOptions();
    }, 1000);
  }
  hide() {
    Animated.timing(this.profileImage, {
      toValue: 0,
      useNativeDriver: true,
      duration: 500,
      delay: 500,
    }).start();
    Animated.timing(this.pan, {
      toValue: 0,
      useNativeDriver: true,
      duration: 250,
    }).start();
    setTimeout(() => {
      this.props?.close();
    }, 250);
  }
  searchIdMessages(id) {
    var index_ = null;
    this.state.messages.forEach((value, index) => {
      if (value.id == id) {
        index_ = index;
      }
    });
    return index_;
  }
  formatMessage(data) {
    return {
      id: data.id,
      text: data?.text,
      timestamp: data?.timestamp,
      media: data?.media,
      gif: data?.gif,
      sticker: data?.sticker,
      sid: data?.sid,
      seen: data?.seen,
      sent: data?.sent,
      reaction: data?.reaction,
      reply: data?.reply,
    };
  }
  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    setTimeout(this.ctart.bind(this), 500);
  }
  async ctart() {
    this.usersnapshot = firestore()
      .collection('users')
      .doc(this.state.user?.uid)
      .onSnapshot((usersnapshot) => {
        const data = {
          user: usersnapshot.data(),
          uid: this.state.user.uid,
          id: this.state.user.id,
        };
        this.setState({
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
        });
      });
    this.msgsnapshot = firestore()
      .collection('messages')
      .doc(this.state.user?.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((documentSnapshot) => {
        const messages = [...this.state.messages];
        documentSnapshot?.docChanges().forEach((value, index) => {
          const mid = this.searchIdMessages(value.doc.id);
          if (mid != null) {
            if (value.type == 'removed') {
              messages[mid] = this.formatMessage({
                id: value.doc.id,
                text: null,
                timestamp: new Date().getTime(),
                media: null,
                gif: null,
                sticker: null,
                sid: value.doc.data()?.sid,
                seen: [],
                sent: [],
                reply: null,
                reaction: false,
              });
            } else {
              messages[mid] = this.formatMessage({
                ...value.doc.data(),
                id: value.doc.id,
              });
            }
          } else {
            messages.push(
              this.formatMessage({...value.doc.data(), id: value.doc.id}),
            );
          }
          if (this.state.messages.length !== 0) this.setState({messages});
        });
        if (this.state.messages.length == 0) this.setState({messages});
      });
  }
  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    this.usersnapshot();
    this.msgsnapshot();
  }
  reply(reply) {
    if (reply != this.state.reply) {
      this.setState({reply});
      if (this.keyboardOpen) {
        this.chatHistoryRef.current?.setNativeProps({
          style: {
            height:
              Dimensions.get('window').height -
              140 -
              this.keyboardOpen.endCoordinates.height -
              70,
          },
        });

        this.chatscrollview.current?.setNativeProps({
          style: {
            height:
              Dimensions.get('window').height -
              140 -
              this.keyboardOpen.endCoordinates.height -
              70,
          },
        });
      }
    }
  }
  sendMessage(data) {
    if (this.state.reply) this.setState({reply: null});
    firestore()
      .collection('messages')
      .doc(this.state.user?.id)
      .update({timestamp: new Date().getTime()});
    firestore()
      .collection('messages')
      .doc(this.state.user?.id)
      .collection('messages')
      .add({
        text: data?.text,
        timestamp: new Date().getTime(),
        media: data?.media,
        gif: data?.gif,
        sticker: data?.sticker,
        sid: this.props.user.uid,
        seen: [this.props.user.uid],
        sent: [this.props.user.uid],
        reply: data?.reply,
        reaction: null,
      });
    firestore().collection('messages').doc(this.state.user?.id).update({
      timestamp: new Date().getTime(),
    });
  }
  _keyboardDidHide() {
    this.keyboardOpen = false;
    if (this.state.reply) this.setState({reply: null});
    Animated.spring(this.keyboardanim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    this.chatHistoryRef.current?.setNativeProps({
      style: {
        height: Dimensions.get('window').height - 115,
      },
    });

    this.chatscrollview.current?.setNativeProps({
      style: {
        height: Dimensions.get('window').height - 115,
      },
    });
  }
  _keyboardDidShow(e) {
    this.keyboardOpen = e;
    const replyshift = this.state.reply ? 70 : 0;
    this.chatHistoryRef.current?.setNativeProps({
      style: {
        height:
          Dimensions.get('window').height -
          140 -
          e.endCoordinates.height -
          replyshift,
      },
    });
    Animated.spring(this.keyboardanim, {
      toValue: -e.endCoordinates.height - 25,
      useNativeDriver: true,
    }).start();
    this.chatscrollview.current?.setNativeProps({
      style: {
        height:
          Dimensions.get('window').height -
          140 -
          e.endCoordinates.height -
          replyshift,
      },
    });
  }
  showMessageOptions(data) {
    this.setState({messageOptions: data});
  }
  hideMessageOptions(data) {
    this.setState({messageOptions: null});
  }
  shouldComponentUpdate(p, s) {
    return p !== this.props || s != this.state;
  }
  render() {
    const {theme} = this.props;
    const data = this.state.user;
    return (
      <Animated.View
        style={{
          transform: [
            {
              translateX: this.pan.interpolate({
                inputRange: [0, Dimensions.get('window').width],
                outputRange: [Dimensions.get('window').width, 0],
              }),
            },
          ],
          height: '100%',
          position: 'absolute',
          width: '100%',
          zIndex: 100,
        }}>
        <Animated.View
          style={{
            transform: [
              {
                translateX: this.pan.interpolate({
                  inputRange: [0, Dimensions.get('window').width],
                  outputRange: [-Dimensions.get('window').width, 0],
                }),
              },
            ],
            top: 0,
            left: 0,
            height: '100%',
            position: 'absolute',
            width: '100%',
            backgroundColor: '#000',
            opacity: this.pan.interpolate({
              inputRange: [0, Dimensions.get('window').width],
              outputRange: [0, 0.9],
            }),
          }}></Animated.View>
        <PanGestureHandler
          activeOffsetX={[-5000, 80]}
          onHandlerStateChange={(e) => {
            if (e.nativeEvent.state != State.ACTIVE) {
              if (
                e.nativeEvent.translationX * 0.8 > 100 ||
                (e.nativeEvent.velocityX > 1000 &&
                  e.nativeEvent.translationX > 50)
              ) {
                if (
                  e.nativeEvent.translationX < 200 &&
                  e.nativeEvent.velocityX < 5
                )
                  this.show();
                else this.hide();
              } else {
                this.show();
              }
            }
          }}
          onGestureEvent={(e) => {
            if (e.nativeEvent.translationX * 0.8 > 0)
              Animated.timing(this.pan, {
                toValue:
                  Dimensions.get('window').width -
                  e.nativeEvent.translationX * 0.8,
                useNativeDriver: true,
                duration: 1,
              }).start();
          }}>
          <Layout
            style={{
              backgroundColor: theme.NavigationTheme.colors.background,
              height: '100%',
              position: 'absolute',
              width: '100%',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.openProfile({data: this.state.user});
              }}>
              <Layout
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingVertical: 5,
                  backgroundColor: 'transparent',
                  borderBottomColor: theme.Colors.placeholder,
                  borderBottomWidth: 1,
                  height: 75,
                }}>
                <Animated.View
                  style={{
                    opacity: this.profileImage,
                    borderRadius: 70,
                    width: 50,
                    height: 50,
                    overflow: 'hidden',
                    marginLeft: 40,
                  }}>
                  <FirebaseImage
                    url={data.photoURL}
                    default={theme.Images.user}
                    style={{width: '100%', height: '100%'}}
                  />
                </Animated.View>
                <View
                  style={{
                    width: Dimensions.get('window').width - 130,
                    paddingLeft: 15,
                    justifyContent: 'space-around',
                    height: 60,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '700',
                      marginBottom: -20,
                    }}
                    numberOfLines={1}>
                    {data.displayName}
                  </Text>
                  <Text numberOfLines={1} appearance="hint">
                    {data.active
                      ? 'Online'
                      : getLastActive(new Date(parseInt(data.lastActive)))}
                  </Text>
                </View>
                <Button
                  appearance="ghost"
                  accessoryRight={(props) => (
                    <Icon
                      name="more-vertical-outline"
                      style={{...props.style, tintColor: theme.Colors.text}}
                    />
                  )}
                />
              </Layout>
            </TouchableWithoutFeedback>

            <View
              ref={this.chatHistoryRef}
              style={{
                width: '100%',
                height: Dimensions.get('window').height - 75 - 40,
                backgroundColor: 'transparent',
              }}>
              <ScrollView style={{transform: [{scale: -1}]}}>
                <ChatHistory
                  ref={this.chatscrollview}
                  data={this.state.messages}
                  theme={theme}
                  users={this.props.data.users}
                  uid={this.props.user.uid}
                  user={this.state.user}
                  reply={this.reply.bind(this)}
                  showMessageOptions={this.showMessageOptions.bind(this)}
                />
              </ScrollView>
            </View>

            <Animated.View
              style={{
                transform: [{translateY: this.keyboardanim}],
                height: 50,
                width: '100%',
                backgroundColor: 'transparent',
                position: 'absolute',
                top: Dimensions.get('window').height - 60,
                zIndex: 10000,
                elevation: 10,
              }}>
              <ChatInput
                send={(text) => {
                  this.sendMessage({
                    text: text,
                    reply: this.state.reply
                      ? this.state.reply.slice(0, 2)
                      : null,
                  });
                }}
                theme={theme}
                openGiphy={() => {
                  Keyboard.dismiss();
                  this.giphyModal.current.modal.current.open();
                }}
                chatHistoryRef={this.chatHistoryRef}
                chatscrollview={this.chatscrollview}
                reply={this.state.reply}
              />
            </Animated.View>
          </Layout>
        </PanGestureHandler>
        {this.state.messageOptions != null && (
          <ChatOptions close={this.hideMessageOptions.bind(this)} />
        )}
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
          }}>
          <Giphy
            ref={this.giphyModal}
            uid={'this.props.auth.user.profile?.giphy'}
            theme={theme}
            send={(media) => {
              this.giphyModal.current?.modal.current?.close();
              if (media.type === 'stickers') {
                this.sendMessage({sticker: media.url});
              } else if (media.type === 'gifs') {
                this.sendMessage({gif: media.url});
              } //else if (media.type === "gallery") this.sendMedia(media.url);
            }}
          />
        </View>
      </Animated.View>
    );
  }
}
export default ChatScreen;
