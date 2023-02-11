import {Icon, Layout, Text} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
import {
  Animated,
  Dimensions,
  findNodeHandle,
  Image,
  UIManager,
  Vibration,
  View,
} from 'react-native';
import {
  LongPressGestureHandler,
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import FirebaseImage from './FirebaseImage';
class ChatItem extends PureComponent {
  state = {
    width: this.props.data.user.active
      ? Dimensions.get('window').width - 120
      : Dimensions.get('window').width - 200,
  };
  pan = new Animated.Value(0);
  image = new Animated.Value(1);
  imageView = React.createRef();

  render() {
    const {theme, data} = this.props;
    var selfSend = data.lastMessage.sid == this.props?.self;
    var seen = data.users?.length == data.lastMessage.seen?.length;
    if (!selfSend && !seen) {
      data.lastMessage.seen.forEach((elem) => {
        if (elem == this.props?.self) {
          seen = true;
        }
      });
    }
    return (
      <TouchableWithoutFeedback
        onPressIn={() => {
          Animated.spring(this.image, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(this.image, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}>
        <View>
          <PanGestureHandler
            activeOffsetX={[-50, 50]}
            onHandlerStateChange={(e) => {
              if (e.nativeEvent.state != State.ACTIVE) {
                Animated.spring(this.pan, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
              }
            }}
            onGestureEvent={(e) => {
              if (Math.abs(e.nativeEvent.translationX) > 200) {
                Animated.timing(this.pan, {
                  toValue: e.nativeEvent.translationX > 0 ? 200 : -200,
                  useNativeDriver: true,
                  duration: 1,
                }).start();
                console.log('vibrate');
              } else {
                Animated.timing(this.pan, {
                  toValue: e.nativeEvent.translationX,
                  useNativeDriver: true,
                  duration: 1,
                }).start();
              }
            }}>
            <LongPressGestureHandler
              onHandlerStateChange={(e) => {
                if (e.nativeEvent.state == State.ACTIVE) {
                  let options = this.props.openProfile
                    ? this.props.openProfile
                    : () => {};
                  this.imageView.measure((fx, fy, width, height, px, py) => {
                    options({
                      px,
                      py,
                      from: 'list',
                      data: data.user,
                    });
                  });
                }
              }}>
              <View>
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e9e9e9',
                  }}
                />
                <Animated.View
                  style={{
                    transform: [
                      {
                        translateX: this.pan.interpolate({
                          inputRange: [0, Dimensions.get('screen').width],
                          outputRange: [
                            0,
                            Dimensions.get('screen').width / 2.5,
                          ],
                        }),
                      },
                    ],
                    backgroundColor: theme.Colors.background,
                  }}>
                  <Animated.View style={[{marginVertical: 15}]}>
                    <Layout
                      style={[
                        theme.Layout.transparent,
                        {
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          paddingHorizontal: 10,
                        },
                      ]}>
                      <TouchableWithoutFeedback
                        onPress={(e) => {
                          let options = this.props.options
                            ? this.props.options
                            : () => {};
                          this.imageView.measure(
                            (fx, fy, width, height, px, py) => {
                              options({
                                px,
                                py,
                                data: data.user,
                                to: 'center',
                                from: 'list',
                              });
                            },
                          );
                        }}>
                        <View
                          onLayout={(e) => {}}
                          ref={(ref) => (this.imageView = ref)}>
                          {this.props.optionsData?.data?.id !== data.user.id ? (
                            <Animated.View
                              style={{
                                transform: [
                                  {
                                    scale: this.image.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [0.95, 1],
                                    }),
                                  },
                                ],
                                width: 70,
                                height: 70,
                                borderRadius: 70,
                                overflow: 'hidden',
                              }}>
                              <Animated.View
                                style={{
                                  transform: [
                                    {
                                      scale: this.image.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1.2, 1],
                                      }),
                                    },
                                  ],
                                  width: 70,
                                  height: 70,
                                  borderRadius: 70,
                                  // overflow: 'hidden',
                                }}>
                                <FirebaseImage
                                  url={data.user.photoURL}
                                  default={theme.Images.user}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                  }}
                                />
                              </Animated.View>
                            </Animated.View>
                          ) : (
                            <View
                              style={{
                                width: 70,
                                height: 70,
                                backgroundColor: theme.Colors.inputBackground,
                                borderRadius: 70,
                              }}
                            />
                          )}
                          {data.user.active && (
                            <View
                              style={{
                                backgroundColor: theme.Colors.primary,
                                width: 15,
                                height: 15,
                                borderRadius: 10,
                                position: 'absolute',
                                right: 3,
                                bottom: 3,
                                elevation: 5,
                              }}
                            />
                          )}
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          let options = this.props.options
                            ? this.props.options
                            : () => {};
                          this.imageView.measure(
                            (fx, fy, width, height, px, py) => {
                              options({
                                px,
                                py,
                                data: data.user,
                                to: 'chat',
                                from: 'list',
                              });
                            },
                          );
                          this.props.openChat({
                            ...data.user,
                            users: data.users,
                          });
                        }}>
                        <View
                          style={{
                            width: Dimensions.get('window').width - 80,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: this.state.width,
                              paddingLeft: 15,
                              justifyContent: 'space-around',
                              height: 60,
                            }}>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: '700',
                                width: this.state.width - 20,
                              }}
                              numberOfLines={1}>
                              {data.user?.displayName}
                            </Text>
                            <View
                              style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                              }}>
                              {selfSend && (
                                <Icon
                                  name="done-all-outline"
                                  style={{
                                    width: 15,
                                    height: 15,
                                    marginRight: 5,
                                    tintColor: seen
                                      ? theme.Colors.primary
                                      : theme.Colors.text,
                                  }}
                                />
                              )}
                              <Text
                                style={{
                                  maxWidth: this.state.width - 80,
                                  fontWeight:
                                    !selfSend && !seen ? 'bold' : 'normal',
                                  fontSize: !selfSend && !seen ? 17 : null,
                                }}
                                numberOfLines={1}>
                                {data.lastMessage.text
                                  ? data.lastMessage.text
                                  : data.lastMessage.sticker
                                  ? 'Sticker'
                                  : data.lastMessage.gif
                                  ? 'GIF'
                                  : data.lastMessage.media
                                  ? 'Media'
                                  : 'New Message'}
                              </Text>
                              {data.lastMessage.timestamp && (
                                <Text
                                  style={{
                                    width: 60,
                                    fontWeight:
                                      !selfSend && !seen ? 'bold' : 'normal',
                                    fontSize: 11,
                                  }}
                                  appearance="hint"
                                  numberOfLines={1}>
                                  {' \u25CF '}
                                  {formatAMPM(
                                    new Date(
                                      parseInt(data.lastMessage.timestamp),
                                    ),
                                  )}
                                </Text>
                              )}
                            </View>
                          </View>
                          {!data.user.active && (
                            <View
                              style={{
                                position: 'absolute',
                                right: 15,
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                              }}
                              onLayout={(e) => {
                                this.setState({
                                  width:
                                    Dimensions.get('window').width -
                                    100 -
                                    e.nativeEvent.layout.width,
                                });
                              }}>
                              <Text style={{fontSize: 11}} appearance="hint">
                                Last Seen
                              </Text>
                              <Text
                                style={{fontSize: 11, marginTop: 5}}
                                appearance="hint">
                                {getLastActive(
                                  new Date(parseInt(data.user.lastActive)),
                                )}
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableWithoutFeedback>
                    </Layout>
                  </Animated.View>
                </Animated.View>
              </View>
            </LongPressGestureHandler>
          </PanGestureHandler>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
export default ChatItem;

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  minutes = minutes ? minutes : '00';
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
export function getLastActive(date_) {
  const date = new Date(date_);
  const now = new Date();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  if (date.getFullYear() == now.getFullYear()) {
    if (date.getDate() == now.getDate()) {
      if (now.getMinutes() - date.getMinutes() < 1) {
        return 'few sec ago';
      } else {
        return 'Today at ' + formatAMPM(date);
      }
    } else if (date.getDate() == now.getDate() - 1) {
      return 'Yesterday at ' + formatAMPM(date);
    } else if (date.getMonth() == now.getMonth()) {
      return (
        date.getDate() +
        ' ' +
        months[date.getMonth()] +
        ' at ' +
        formatAMPM(date)
      );
    }
  } else {
    return (
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    );
  }
  return date.getTime();
}
