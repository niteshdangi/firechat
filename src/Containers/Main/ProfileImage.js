import {Button, Icon, Layout} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
import {Animated, Dimensions, Image, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
class ProfileImage extends PureComponent {
  anim = new Animated.Value(0);
  state = {
    to: this.props.options.to,
    from: this.props.options.from,
    options: this.props.options,
  };
  componentDidMount() {}
  hide() {
    Animated.spring(this.anim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    setTimeout(this.props.close, 90);
  }
  render() {
    Animated.timing(this.anim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 1,
    }).start();
    const {to, from, options} = this.state;
    setTimeout(() => {
      Animated.spring(this.anim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 100);
    const {py, px, data} = options;
    var iw = 70;
    var ih = 70;
    var outputRangeWidth = [0, 1];
    var outputRangeHeight = [0, 1];
    var outputRangeRadius = [0, 1, 1];
    var outputRangeTop = [0, 1];
    var outputRangeLeft = [0, 1];
    var outputRangeOpacity = [1, 1];
    if (to == 'center' && from == 'list') {
      outputRangeWidth = [0.25, 1];
      iw = Dimensions.get('window').width - 100;
    } else if (to == 'chat' && from == 'list') {
      outputRangeWidth = [1.5, 1];
      iw = 50;
    }

    if (to == 'center' && from == 'list') {
      outputRangeHeight = [0.25, 1];
      ih = iw;
    } else if (to == 'chat' && from == 'list') {
      outputRangeHeight = [1.5, 1];
      ih = iw;
    }

    if (to == 'center' && from == 'list') {
      outputRangeRadius = [iw, 10, 10];
    } else if (to == 'chat' && from == 'list') {
      outputRangeRadius = [iw, iw, iw];
    }

    if (to == 'center' && from == 'list') {
      outputRangeOpacity = [0.2, 1];
    }

    if (to == 'center' && from == 'list') {
      outputRangeTop = [
        py - 70 * 2,
        Dimensions.get('window').height / 2 - ih / 2,
      ];
    } else if (to == 'chat' && from == 'list') {
      outputRangeTop = [py - 18, 12];
    }

    if (to == 'center' && from == 'list') {
      outputRangeLeft = [
        px - 70 * 2 + 29,
        Dimensions.get('window').width / 2 - iw / 2,
      ];
    } else if (to == 'chat' && from == 'list') {
      outputRangeLeft = [px + 12, 29];
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
    const opacity = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeOpacity,
    });
    const top = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeTop,
    });
    const left = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: outputRangeLeft,
    });
    return (
      <>
        {to == 'center' && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: this.anim,
              backgroundColor: 'rgba(0,0,0,0.6)',
              width: '100%',
              height: '200%',
              marginTop: -50,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                Animated.spring(this.anim, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();

                setTimeout(this.props.close, 90);
              }}
              style={{width: '100%', height: '100%'}}
            />
          </Animated.View>
        )}

        <Animated.View
          style={{
            width: iw,
            height: ih,
            borderRadius,
            top: 0,
            left: 0,
            position: 'absolute',
            backgroundColor: '#e9e9e9',
            elevation: 10,
            overflow: 'hidden',
            // opacity,
            transform: [
              {translateX: left},
              {translateY: top},
              {scaleX: width},
              {scaleY: height},
            ],
          }}>
          <Image
            source={data.user.image}
            style={{width: '100%', height: '100%'}}
          />
        </Animated.View>
      </>
    );
  }
}
export default ProfileImage;
