import {Icon, Text} from '@ui-kitten/components';
import Lightbox from 'react-native-lightbox';
import React, {Component, PureComponent} from 'react';
import {View, Image, Dimensions, Animated} from 'react-native';
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import DoubleClick from './DoubleClick';
import {formatAMPM} from './ChatItem';
import firestore from '@react-native-firebase/firestore';

class Message extends Component {
  state = {reaction: false, seen: null, deleted: false, imageratio: 1};
  pan = new Animated.Value(0);
  press = new Animated.Value(1);
  reactanim = new Animated.Value(0);
  appear = new Animated.Value(0);
  componentDidMount() {
    if (this.deleted()) return false;
    setTimeout(() => {
      Animated.spring(this.appear, {toValue: 1, useNativeDriver: true}).start();
    }, 100);
    this.checkSeen();
  }
  reactemoji() {
    if (this.deleted()) return false;
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
    return p !== this.props || s != this.state;
  }
  componentDidUpdate() {
    this.checkSeen();
  }
  async checkSeen() {
    const {data, users} = this.props;
    if (this.deleted()) return false;
    const self = data?.sid == this.props?.uid;
    var seen = users?.length == data.seen?.length;
    if (!self && !seen) {
      data?.seen?.forEach((elem) => {
        if (elem == this.props?.self) {
          seen = true;
        }
      });
    }
    if (seen != this.state.seen) {
      setTimeout(() => {
        this.setState({seen});
      }, 100);
    }
    if (!self && !seen) {
      console.log('updating');
      firestore()
        .collection('messages')
        .doc(this.props.user.id)
        .update({timestamp: new Date().getTime()});
      firestore()
        .collection('messages')
        .doc(this.props.user.id)
        .collection('messages')
        .doc(data.id)
        .update({seen: [...data.seen, this.props.uid]});
    }
  }
  showDate(date) {
    if (this.deleted()) return null;
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
    const now = new Date();
    date = new Date(date);
    if (date.getFullYear() == now.getFullYear()) {
      if (date.getDate() == now.getDate()) {
        return 'Today';
      } else if (date.getDate() == now.getDate() - 1) {
        return 'Yesterday';
      } else if (date.getMonth() == now.getMonth()) {
        return date.getDate() + ' ' + months[date.getMonth()];
      }
    }
    return (
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    );
  }
  deleted() {
    const {data} = this.props;
    return !data.text && !data.gif && !data.sticker && !data.media;
  }
  render() {
    const {reaction} = this.state;
    const {data, prev, next} = this.props;
    if (this.state.deleted) {
      return <></>;
    }
    if (this.deleted()) {
      Animated.spring(this.press, {
        toValue: 0,
        useNativeDriver: true,
        delay: 1000,
      }).start();
      setTimeout(() => {
        this.setState({deleted: true});
      }, 1200);
    }
    const self = data?.sid !== this.props?.uid;
    const selfnext = next?.sid !== this.props?.uid;
    const selfprev = prev?.sid !== this.props?.uid;
    const showDate =
      new Date(parseInt(data?.timestamp)).getDate() !=
        new Date(parseInt(prev?.timestamp)).getDate() ||
      new Date(parseInt(data?.timestamp)).getMonth() !=
        new Date(parseInt(prev?.timestamp)).getMonth() ||
      new Date(parseInt(data?.timestamp)).getFullYear() !=
        new Date(parseInt(prev?.timestamp)).getFullYear();
    // const newmessage = !self &&
    const showTime =
      new Date(parseInt(data?.timestamp)).getMinutes() ==
        new Date(parseInt(next?.timestamp)).getMinutes() &&
      new Date(parseInt(data?.timestamp)).getHours() ==
        new Date(parseInt(next?.timestamp)).getHours() &&
      ((self && selfnext) || (!self && !selfnext));
    const prevtime =
      new Date(parseInt(prev?.timestamp)).getMinutes() ==
        new Date(parseInt(data?.timestamp)).getMinutes() &&
      new Date(parseInt(prev?.timestamp)).getHours() ==
        new Date(parseInt(data?.timestamp)).getHours() &&
      ((self && selfprev) || (!self && !selfprev));
    const deleted = this.deleted();
    if (data.gif)
      Image.getSize(data.gif, (w, h) => {
        let imageratio = w / h;
        if (this.state.imageratio != imageratio) this.setState({imageratio});
      });
    return (
      <View>
        {showDate && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 5,
            }}>
            <Text appearance="hint" style={{fontSize: 12}}>
              {this.showDate(new Date(parseInt(data.timestamp)))}
            </Text>
          </View>
        )}
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
              this.props.showMessageOptions({id: data.id});
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
                paddingHorizontal: 10,
                paddingVertical: showTime ? 2.5 : prevtime ? 2.5 : 5,
                justifyContent: 'center',
                alignItems: self ? 'flex-start' : 'flex-end',
                flexDirection: 'column',
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
                      let text = data.text;
                      if (!text) {
                        if (data.sticker) text = 'Sticker';
                        else if (data.gif) text = 'GIF';
                        else if (data.media) text = 'Media';
                      }
                      if (text)
                        this.props.reply([
                          data.sid,
                          text,
                          self ? 'Self' : this.props.user.displayName,
                        ]);
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
                    let text = data.text;
                    if (!text) {
                      if (data.sticker) text = 'Sticker';
                      else if (data.gif) text = 'GIF';
                      else if (data.media) text = 'Media';
                    }
                    if (text)
                      this.props.reply([
                        data.sid,
                        text,
                        !self ? 'Self' : this.props.user.displayName,
                      ]);
                  }
                }}>
                <View>
                  {data.reply && (
                    <Animated.View
                      style={{
                        padding: 15,
                        backgroundColor: self ? '#ffa500a1' : '#80808087',
                        borderRadius: 20,
                        maxWidth: Dimensions.get('window').width - 95,
                        minWidth: 60,
                        transform: [
                          {scale: this.press},
                          {translateX: self ? 20 : -20},
                        ],
                        marginBottom: 2.5,
                        height: 43,
                        marginTop: 15,
                      }}>
                      <Text numberOfLines={1}>{data.reply?.[1]}</Text>
                      <View
                        style={[
                          {
                            position: 'absolute',
                            width: 3,
                            height: 43 + 15,
                            backgroundColor: self ? '#ffa500a1' : '#80808087',
                            borderRadius: 2,
                            top: -15,
                          },
                          self ? {left: -15} : {right: -15},
                        ]}
                      />
                      <View
                        style={[
                          {
                            position: 'absolute',
                            width: Dimensions.get('window').width - 30,
                            height: 15,
                            top: -15,
                            alignItems: self ? 'flex-start' : 'flex-end',
                            paddingHorizontal: 5,
                          },
                          self ? {left: 0} : {right: 0},
                        ]}>
                        {!self ? (
                          <Text style={{fontSize: 12}} numberOfLines={1}>
                            Replied to{' '}
                            {data.reply?.[0] == this.props.uid
                              ? 'Self'
                              : this.props.user.displayName}
                          </Text>
                        ) : (
                          <Text style={{fontSize: 12}} numberOfLines={1}>
                            {this.props.user.displayName} replied to{' '}
                            {data.reply?.[0] == this.props.uid
                              ? 'you'
                              : 'himself'}
                          </Text>
                        )}
                      </View>
                    </Animated.View>
                  )}
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

                    <Animated.View
                      style={{
                        padding: data.text ? 15 : 5,
                        backgroundColor: deleted
                          ? 'white'
                          : data.text || data.media || data.gif
                          ? self
                            ? 'orange'
                            : 'gray'
                          : 'transparent',
                        borderRadius: 15,
                        borderBottomRightRadius: showTime
                          ? self
                            ? 15
                            : 1
                          : 15,
                        borderTopRightRadius: showTime
                          ? self
                            ? 15
                            : prevtime
                            ? 1
                            : 15
                          : prevtime && !self
                          ? 1
                          : 15,
                        borderBottomLeftRadius: showTime
                          ? !self
                            ? 15
                            : 1
                          : 15,
                        borderTopLeftRadius: showTime
                          ? !self
                            ? 15
                            : prevtime
                            ? 1
                            : 15
                          : prevtime && self
                          ? 1
                          : 15,
                        maxWidth: Dimensions.get('window').width - 75,
                        minWidth: 60,
                        transform: [{scale: this.press}],
                      }}>
                      {data.text != '' && data.text != null && (
                        <Text
                          style={[
                            {fontSize: 16},
                            deleted ? {color: 'red'} : {},
                          ]}>
                          {deleted ? 'deleted' : data.text}
                        </Text>
                      )}
                      {data.sticker && (
                        <Image
                          source={{uri: data.sticker}}
                          style={{
                            height: Dimensions.get('window').width / 2,
                            width: Dimensions.get('window').width / 2,
                          }}
                          resizeMode="contain"
                        />
                      )}
                      {data.gif && (
                        <View
                          style={{
                            height: Dimensions.get('window').width - 200,
                            borderRadius: 10,
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              aspectRatio: this.state.imageratio,
                            }}>
                            <Lightbox
                              springConfig={{
                                tension: 30,
                                friction: 10,
                                useNativeDriver: false,
                              }}
                              activeProps={{resizeMode: 'contain'}}>
                              <Image
                                source={{uri: data.gif}}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                }}
                                resizeMode="contain"
                              />
                            </Lightbox>
                          </View>
                        </View>
                      )}
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
                    </Animated.View>
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
                </View>
              </PanGestureHandler>
              {!showTime && (
                <Animated.View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: 2,
                    paddingHorizontal: 5,

                    transform: [{scale: this.press}],
                  }}>
                  <Text style={{fontSize: 12}}>
                    {formatAMPM(new Date(parseInt(data.timestamp)))}{' '}
                  </Text>
                  {!self && (
                    <Icon
                      name={deleted ? 'trash-2-outline' : 'done-all-outline'}
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: deleted
                          ? 'red'
                          : this.state.seen
                          ? 'orange'
                          : '#a9a9a9',
                      }}
                    />
                  )}
                </Animated.View>
              )}
            </Animated.View>
          </DoubleClick>
        </Animated.View>
      </View>
    );
  }
}

export default Message;
