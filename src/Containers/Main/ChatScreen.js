import {Button, Icon, Input, Layout, Text} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
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
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatOptions from './ChatOptions';
import Giphy from './Giphy';
class ChatScreen extends PureComponent {
  state = {
    messageOptions: null,
    messages: [{id: 0}, {id: 1}],
  };
  pan = new Animated.Value(0);
  openProfile = new Animated.Value(0);
  profileImage = new Animated.Value(0);
  keyboardanim = new Animated.Value(0);
  chatHistoryRef = React.createRef();
  chatscrollview = React.createRef();
  giphyModal = React.createRef();

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
      delay: 800,
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
  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
  }
  _keyboardDidHide() {
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
    this.chatHistoryRef.current?.setNativeProps({
      style: {
        height: Dimensions.get('window').height - 140 - e.endCoordinates.height,
      },
    });
    Animated.spring(this.keyboardanim, {
      toValue: -e.endCoordinates.height - 25,
      useNativeDriver: true,
    }).start();
    this.chatscrollview.current?.setNativeProps({
      style: {
        height: Dimensions.get('window').height - 140 - e.endCoordinates.height,
      },
    });
  }
  showMessageOptions(data) {
    this.setState({messageOptions: data});
  }
  hideMessageOptions(data) {
    this.setState({messageOptions: null});
  }
  render() {
    const {data, theme} = this.props;
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
        }}>
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
            backgroundColor: '#000',
            opacity: this.pan.interpolate({
              inputRange: [0, Dimensions.get('window').width],
              outputRange: [0, 0.5],
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
                this.props.openProfile();
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
                  <Image
                    source={data.user.image}
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
                    {data.user.name}
                  </Text>
                  <Text numberOfLines={1} appearance="hint">
                    Online
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
              {/* <FlatList
                data={[{item: 0}]}
                // style={{transform: [{scale: -1}]}}
                inverted
                keyExtractor={(props) => props.item}
                renderItem={(props) =>
                  props.index == 0 ? (
                    
                  ) : (
                    <View />
                  )
                }
              /> */}
              <ScrollView style={{transform: [{scale: -1}]}}>
                <ChatHistory
                  ref={this.chatscrollview}
                  data={this.state.messages}
                  theme={theme}
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
              }}>
              <ChatInput
                send={() => {
                  this.setState({
                    messages: [...this.state.messages, {id: Math.random()}],
                  });
                }}
                theme={theme}
                openGiphy={() => {
                  Keyboard.dismiss();
                  this.giphyModal.current.modal.current.open();
                }}
                chatHistoryRef={this.chatHistoryRef}
                chatscrollview={this.chatscrollview}
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
              // this.giphyModal.current?.modal.current?.close();
              // if (media.type === "stickers") {
              //   this.sendMessage("", media.url);
              // } else if (media.type === "gifs") {
              //   this.sendMessage("", "", media.url);
              // } else if (media.type === "gallery") this.sendMedia(media.url);
            }}
          />
        </View>
      </Animated.View>
    );
  }
}
export default ChatScreen;
