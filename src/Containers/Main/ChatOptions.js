import {Button, Icon, Layout} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
import {Animated, Dimensions, Image, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
class ChatOptions extends PureComponent {
  bganim = new Animated.Value(0);
  moveImage = new Animated.Value(0);
  moveImageBig = new Animated.Value(0);
  componentDidMount() {
    setTimeout(() => {
      Animated.spring(this.bganim, {toValue: 1, useNativeDriver: true}).start();
    }, 100);
  }
  render() {
    const {close} = this.props;
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: this.bganim,
            backgroundColor: 'rgba(0,0,0,0.6)',
            width: '100%',
            height: '200%',
            marginTop: -50,
          }}>
          <TouchableWithoutFeedback
            style={{width: '100%', height: '200%'}}
            onPress={() => {
              Animated.spring(this.bganim, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
              setTimeout(close, 80);
            }}></TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View
          style={{
            width: 200,
            height: 200,
            borderRadius: 10,
            backgroundColor: '#e9e9e9',
            position: 'absolute',
            top: Dimensions.get('screen').height / 2 - 100,
            left: Dimensions.get('screen').width / 2 - 100,
            opacity: this.bganim,
            transform: [
              {
                scale: this.bganim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}></Animated.View>
      </View>
    );
  }
}
export default ChatOptions;
