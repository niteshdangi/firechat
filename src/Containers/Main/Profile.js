import React, {PureComponent} from 'react';
import {Animated, Dimensions, View, Image} from 'react-native';
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
export default class Profile extends PureComponent {
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
  render() {
    const {theme, data} = this.props;
    const profile = data.data;
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
      outputRangeWidth = [0.18, 1];
      outputRangeHeight = [0.18, 1];
      outputRangeRadius = [Dimensions.get('window').width, 0, 0];
      outputRangeTop = [data.py - Dimensions.get('window').width / 2 + 5, 0];
      outputRangeLeft = [-Dimensions.get('window').width / 2 + 45, 0];
      outputRangeWidthName = [0.64, 1];
      outputRangeHeightName = [0.6, 1];
      outputRangeTopName = [data.py - Dimensions.get('window').width + 32, 0];
      outputRangeLeftName = [18, 0];
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
            height: '100%',
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
              inputRange: [0, 100, Dimensions.get('screen').height],
              outputRange: [
                0,
                Dimensions.get('screen').height,
                Dimensions.get('screen').height * 5,
              ],
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
            <Image
              source={profile.user.image}
              style={{width: '100%', height: '100%'}}
            />
          </Animated.View>
          <Animated.View
            style={{
              top: Dimensions.get('window').width - 60,
              left: 10,
              transform: [
                {translateX: leftName},
                {translateY: topName},
                {scaleX: widthName},
                {scaleY: heightName},
              ],
            }}>
            <Animated.Text style={{fontSize: 30}}>
              {profile.user.name}
            </Animated.Text>
            <Animated.Text
              style={{fontSize: 20, marginTop: 5, opacity: opacityOnline}}>
              Online
            </Animated.Text>
          </Animated.View>
          <Animated.ScrollView
            style={{
              backgroundColor: theme.Colors.background,
              top: Dimensions.get('window').width - 54,
              height:
                Dimensions.get('screen').height -
                Dimensions.get('window').width,
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
            }}></Animated.ScrollView>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
