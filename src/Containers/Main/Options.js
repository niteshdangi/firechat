import {Button, Icon, Layout} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
import {Animated, Dimensions, Image, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
class Options extends PureComponent {
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
      <TouchableWithoutFeedback onPress={close}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: this.bganim,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}></Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
export default Options;
