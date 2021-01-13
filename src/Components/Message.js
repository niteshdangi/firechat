import {Icon, Text} from '@ui-kitten/components';
import React, {Component, PureComponent} from 'react';
import {View, Image, Dimensions, Animated} from 'react-native';
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import DoubleClick from './DoubleClick';

class Message extends Component {
  state = {reaction: false, self: Math.floor(Math.random() * 3) == 2};
  pan = new Animated.Value(0);
  press = new Animated.Value(1);
  reactanim = new Animated.Value(0);
  appear = new Animated.Value(0);
  componentDidMount() {
    setTimeout(() => {
      Animated.spring(this.appear, {toValue: 1, useNativeDriver: true}).start();
    }, 100);
  }
  reactemoji() {
    this.setState({reaction: true});
    setTimeout(() => {
      Animated.spring(this.reactanim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.spring(this.reactanim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }, 150);
    }, 20);
  }
  shouldComponentUpdate(p, s) {
    return p.id !== this.props.id;
  }
  render() {
    const {reaction, self} = this.state;
    console.log(this.props.id);
    return (
      <Animated.View
        style={{
          transform: [
            {
              translateY: this.appear.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
          opacity: this.appear.interpolate({
            inputRange: [0.5, 1],
            outputRange: [0.1, 1],
          }),
        }}>
        <DoubleClick
          onLongPress={() => {
            this.props.showMessageOptions({id: 98});
          }}
          onDoublePress={() => {
            this.reactemoji();
          }}
          onPressIn={() => {
            Animated.spring(this.press, {
              toValue: 0.95,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(this.press, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}>
          <Animated.View
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: self ? 'flex-start' : 'flex-end',
              flexDirection: 'column',
              transform: [{scale: this.press}],
            }}>
            <PanGestureHandler
              activeOffsetX={self ? [-500, 20] : [-20, 500]}
              onHandlerStateChange={(e) => {
                if (e.nativeEvent.state !== State.ACTIVE) {
                  Animated.spring(this.pan, {
                    toValue: 0,
                    useNativeDriver: true,
                  }).start();
                  let velocity = self
                    ? e.nativeEvent.velocityX > 1000
                      ? true
                      : false
                    : e.nativeEvent.velocityX < -1000
                    ? true
                    : false;
                  if (
                    velocity &&
                    Math.abs(e.nativeEvent.translationX * 0.4) > 30
                  ) {
                    console.log('reply');
                  }
                }
              }}
              onGestureEvent={(e) => {
                if (
                  e.nativeEvent.state == State.ACTIVE &&
                  Math.abs(e.nativeEvent.translationX * 0.4) < 83
                ) {
                  let toValue = self
                    ? e.nativeEvent.translationX * 0.4 > 0
                      ? e.nativeEvent.translationX * 0.4
                      : 0
                    : e.nativeEvent.translationX * 0.4 < 0
                    ? e.nativeEvent.translationX * 0.4
                    : 0;
                  Animated.timing(this.pan, {
                    toValue,
                    useNativeDriver: true,
                    duration: 1,
                  }).start();
                } else {
                  Animated.spring(this.pan, {
                    toValue: 0,
                    useNativeDriver: true,
                  }).start();
                  console.log('reply');
                }
              }}>
              <Animated.View
                style={{
                  transform: [{translateX: this.pan}],
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                {self && (
                  <Animated.View
                    style={{
                      backgroundColor: 'orange',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      marginLeft: -60,
                      marginRight: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: [
                        {
                          translateX: this.pan.interpolate({
                            inputRange: [0, 80, 110],
                            outputRange: [-20, 10, 10],
                          }),
                        },
                        {
                          scale: this.pan.interpolate({
                            inputRange: [0, 60, 110],
                            outputRange: [0, 1.2, 1.2],
                          }),
                        },
                      ],
                      opacity: this.pan.interpolate({
                        inputRange: [0, 60, 80, 110],
                        outputRange: [0, 0.5, 1, 1],
                      }),
                    }}>
                    <Icon
                      name="corner-down-right-outline"
                      style={{width: 15, height: 15, tintColor: '#a9a9a9'}}
                    />
                  </Animated.View>
                )}
                <View
                  style={{
                    padding: 15,
                    paddingHorizontal: 25,
                    backgroundColor: self ? 'orange' : 'gray',
                    borderRadius: 15,
                    maxWidth: Dimensions.get('window').width - 75,
                  }}>
                  <Text style={{fontSize: 16}}>
                    hyig f ghfh vkhgf ybfyfbfy fhg fhgfbhgfbytf g fkhgf tyf
                    hvhgv hgfbttft y fyfhgfj g {this.props.id}
                  </Text>
                  {reaction && (
                    <Animated.View
                      style={{
                        position: 'absolute',
                        left: self ? null : -5,
                        right: self ? -5 : null,
                        bottom: -5,
                        width: 30,
                        height: 25,
                        borderRadius: 25,
                        backgroundColor: !self ? 'orange' : '#a9a9a9',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [
                          {
                            scale: this.reactanim.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [1, 1.2, 1.1],
                            }),
                          },
                        ],
                      }}>
                      <TouchableWithoutFeedback
                        style={{}}
                        onPress={() => {
                          this.setState({reaction: false});
                        }}>
                        <Text>🔥</Text>
                      </TouchableWithoutFeedback>
                    </Animated.View>
                  )}
                </View>
                {!self && (
                  <Animated.View
                    style={{
                      backgroundColor: 'orange',
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      marginRight: -60,
                      marginLeft: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: [
                        {
                          translateX: this.pan.interpolate({
                            inputRange: [-110, -80, 0],
                            outputRange: [-10, -10, 20],
                          }),
                        },
                        {
                          scale: this.pan.interpolate({
                            inputRange: [-110, -60, 0],
                            outputRange: [1.2, 1.2, 0],
                          }),
                        },
                      ],
                      opacity: this.pan.interpolate({
                        inputRange: [-110, -80, -60, 0],
                        outputRange: [1, 1, 0.5, 0],
                      }),
                    }}>
                    <Icon
                      name="corner-down-right-outline"
                      style={{width: 15, height: 15, tintColor: '#a9a9a9'}}
                    />
                  </Animated.View>
                )}
              </Animated.View>
            </PanGestureHandler>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                paddingTop: 2,
                paddingHorizontal: 5,
              }}>
              <Text style={{fontSize: 12}}>10:00 AM </Text>
              {!self && (
                <Icon
                  name="done-all-outline"
                  style={{width: 15, height: 15, tintColor: 'orange'}}
                />
              )}
            </View>
          </Animated.View>
        </DoubleClick>
      </Animated.View>
    );
  }
}

export default Message;
