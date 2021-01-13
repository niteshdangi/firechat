import {Button, Icon} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
import {Dimensions, View, Animated, TextInput} from 'react-native';
class ChatInput extends PureComponent {
  input = React.createRef();
  container = React.createRef();
  sendanim = new Animated.Value(0);
  render() {
    const {theme} = this.props;
    return (
      <View
        ref={this.container}
        style={{
          backgroundColor: theme.Colors.inputBackground,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginHorizontal: 10,
          borderRadius: 25,
          elevation: 5,
          overflow: 'hidden',
        }}>
        <Button
          onPress={this.props.openGiphy}
          appearance="ghost"
          style={{width: 20, padding: 0, height: 20}}
          accessoryLeft={(props) => (
            <Icon
              name="smiling-face-outline"
              style={{
                width: 30,
                height: 30,
                tintColor: theme.Colors.placeholder,
                marginLeft: 3,
              }}
            />
          )}
        />
        <TextInput
          ref={this.input}
          multiline
          placeholder="Type a message"
          onContentSizeChange={(e) => {
            let height =
              e.nativeEvent.contentSize.height < 48.4
                ? 48.4
                : e.nativeEvent.contentSize.height;
            this.input.current?.setNativeProps({
              style: {
                height,
              },
            });
            let translateY = -height + 48.4;
            this.container.current?.setNativeProps({
              style: {
                transform: [{translateY: translateY < -52 ? -52 : translateY}],
              },
            });
            this.props?.chatHistoryRef.current?.setNativeProps({
              style: {paddingBottom: translateY < -52 ? 52 : -translateY},
            });
            this.props?.chatscrollview.current?.setNativeProps({
              style: {paddingBottom: translateY < -52 ? 52 : -translateY},
            });
          }}
          onChange={(e) => {
            const text = e.nativeEvent.text.trim();
            if (text) {
              Animated.timing(this.sendanim, {
                toValue: 1,
                useNativeDriver: true,
                duration: 100,
              }).start();
              this.input.current?.setNativeProps({
                style: {
                  width: Dimensions.get('window').width - 140,
                },
              });
            } else {
              Animated.spring(this.sendanim, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
              setTimeout(
                () =>
                  this.input.current?.setNativeProps({
                    style: {
                      width: Dimensions.get('window').width - 110,
                    },
                  }),
                100,
              );
            }
          }}
          style={{
            fontSize: 17,
            backgroundColor: 'transparent',
            maxHeight: 100,
            width: Dimensions.get('window').width - 110,
          }}
        />
        <Animated.View
          style={{
            transform: [
              {
                translateX: this.sendanim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [35, -5],
                }),
              },
            ],
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            right: 0,
          }}>
          <Button
            appearance="ghost"
            style={{width: 20, padding: 0, height: 20}}
            accessoryLeft={(props) => (
              <Icon
                name="mic-outline"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: theme.Colors.placeholder,
                }}
              />
            )}
          />
          <Animated.View style={{opacity: this.sendanim}}>
            <Button
              onPress={() => {
                this.props.send();
                this.input.current.clear();
                Animated.spring(this.sendanim, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
                setTimeout(
                  () =>
                    this.input.current?.setNativeProps({
                      style: {
                        width: Dimensions.get('window').width - 110,
                      },
                    }),
                  100,
                );
              }}
              appearance="ghost"
              style={{width: 20, padding: 0, height: 20}}
              accessoryLeft={(props) => (
                <Icon
                  name="paper-plane-outline"
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: theme.Colors.primary,
                    marginRight: 3,
                  }}
                />
              )}
            />
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}
export default ChatInput;
