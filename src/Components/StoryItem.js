import {Icon} from '@ui-kitten/components';
import React from 'react';
import {Animated, Image, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
class StoryItem extends React.PureComponent {
  anim = new Animated.Value(1);
  render() {
    const {self, theme} = this.props;
    return (
      <TouchableWithoutFeedback
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
        }}
        onPressIn={() => {
          Animated.spring(this.anim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(this.anim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}>
        <Animated.View
          style={{
            transform: [
              {
                scale: this.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          }}>
          <View
            style={{
              borderRadius: 60,
              borderWidth: 2,
              padding: 2,
              borderColor: self ? 'transparent' : theme.Colors.primary,
              overflow: 'hidden',
            }}>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: this.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.15, 1],
                    }),
                  },
                ],
              }}>
              <Image
                source={this.props.image}
                style={{width: 60, height: 60, borderRadius: 100}}
              />
            </Animated.View>
          </View>
          {self && (
            <View
              style={{
                position: 'absolute',
                right: 5,
                bottom: 5,
                backgroundColor: theme.Colors.primary,
                borderRadius: 20,
              }}>
              <Icon
                name="plus-outline"
                style={{width: 20, height: 20, tintColor: theme.Colors.text}}
              />
            </View>
          )}
        </Animated.View>
        <Text
          style={{
            textAlign: 'center',
            maxWidth: 65,
            fontSize: 12,
            overflow: 'hidden',
            marginTop: 5,
          }}
          textBreakStrategy="highQuality"
          numberOfLines={1}>
          {self ? 'My Status' : this.props.name}
        </Text>
      </TouchableWithoutFeedback>
    );
  }
}
export default StoryItem;
