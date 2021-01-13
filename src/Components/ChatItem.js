import {Layout, Text} from '@ui-kitten/components';
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
class ChatItem extends PureComponent {
  state = {
    width: this.props.data.user.active
      ? Dimensions.get('window').width - 120
      : Dimensions.get('window').width - 200,
  };
  pan = new Animated.Value(0);
  image = new Animated.Value(1);
  imageView = React.createRef();
  handleLayoutChange() {}
  render() {
    const {theme, data} = this.props;

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
                      data,
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
                    backgroundColor: theme.NavigationTheme.colors.background,
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
                                data,
                                to: 'center',
                                from: 'list',
                              });
                            },
                          );
                        }}>
                        <View
                          onLayout={(event) => {
                            this.handleLayoutChange(event);
                          }}
                          ref={(ref) => (this.imageView = ref)}>
                          {this.props.optionsData?.data.user.id !==
                          data.user.id ? (
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
                                  overflow: 'hidden',
                                }}>
                                <Image
                                  source={data.user.image}
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
                              options({px, py, data, to: 'chat', from: 'list'});
                            },
                          );
                          this.props.openChat();
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
                              {data.user.name}
                            </Text>
                            <View
                              style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  maxWidth: this.state.width - 80,
                                }}
                                numberOfLines={1}>
                                {data.message.text}
                              </Text>
                              <Text
                                style={{
                                  width: 60,
                                  fontSize: 11,
                                }}
                                appearance="hint"
                                numberOfLines={1}>
                                {' \u25CF '}
                                {data.message.time}
                              </Text>
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
                                Today at 10:00 AM
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
