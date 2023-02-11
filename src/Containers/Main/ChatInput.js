import {Button, Icon, Text} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
import {Dimensions, View, Animated, TextInput} from 'react-native';
class ChatInput extends PureComponent {
  input = React.createRef();
  container = React.createRef();
  sendanim = new Animated.Value(0);
  text = '';
  render() {
    const {theme} = this.props;
    const reply = this.props.reply && this.props.reply?.length >= 2;
    if (reply) {
      this.input.current?.blur();
      this.input.current?.focus();
    }
    return (
      <View>
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
            zIndex: 100,
          }}>
          {reply && (
            <View
              style={{
                backgroundColor: theme.Colors.inputBackground,
                padding: 15,
                justifyContent: 'space-between',
                top: -70,
                borderRadius: 25,
                paddingBottom: 60,
                marginBottom: -40,
                position: 'absolute',
                width: Dimensions.get('window').width - 20,
              }}>
              <Text appearance="hint" style={{marginBottom: 10}}>
                Replying to {this.props.reply[2]}
              </Text>
              <Text numberOfLines={1}>{this.props.reply[1]}</Text>
            </View>
          )}
          <Button
            style={{width: 20, height: 20}}
            onPress={this.props.openGiphy}
            appearance="ghost"
            accessoryRight={() => (
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
                  transform: [
                    {translateY: translateY < -52 ? -52 : translateY},
                  ],
                },
              });
              this.props?.chatHistoryRef.current?.setNativeProps({
                style: {
                  paddingBottom: translateY < -52 ? 52 : -translateY,
                },
              });
              this.props?.chatscrollview.current?.setNativeProps({
                style: {
                  paddingBottom: translateY < -52 ? 52 : -translateY,
                },
              });
            }}
            onChange={(e) => {
              const text = e.nativeEvent.text.trim();
              this.text = text;
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
              zIndex: 1000,
              borderTopWidth: reply ? 1 : 0,
              borderColor: theme.Colors.text,
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
              style={{width: 20, height: 20}}
              // onPress={this.props.openGiphy}
              appearance="ghost"
              accessoryRight={() => (
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
                style={{width: 20, height: 20}}
                onPress={() => {
                  this.props.send(this.text);

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
                accessoryRight={() => (
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
      </View>
    );
  }
}
export default ChatInput;
