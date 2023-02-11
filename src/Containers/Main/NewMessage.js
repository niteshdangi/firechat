import {Button, Icon, Layout, Spinner, Text} from '@ui-kitten/components';
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
import firestore from '@react-native-firebase/firestore';
import FirebaseImage from '../../Components/FirebaseImage';
class NewMessage extends PureComponent {
  image = new Animated.Value(1);
  imageView = React.createRef();

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
          <View>
            <Animated.View style={[{marginVertical: 15}]}>
              <Layout
                style={[
                  theme.Layout.transparent,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  },
                ]}>
                <TouchableWithoutFeedback
                  onPress={(e) => {
                    let options = this.props.options
                      ? this.props.options
                      : () => {};
                    this.imageView.measure((fx, fy, width, height, px, py) => {
                      options({
                        px,
                        py,
                        data: {id: data.uid, ...data},
                        to: 'center',
                        from: 'list',
                      });
                    });
                  }}>
                  <View
                    onLayout={(e) => {}}
                    ref={(ref) => (this.imageView = ref)}>
                    {this.props.optionsData?.data?.id !== data.uid ? (
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
                            // overflow: 'hidden',
                          }}>
                          <FirebaseImage
                            url={data.photoURL}
                            default={theme.Images.user}
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
                    {data.active && (
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
                    // let options = this.props.options
                    //   ? this.props.options
                    //   : () => {};
                    // this.imageView.measure((fx, fy, width, height, px, py) => {
                    //   options({
                    //     px,
                    //     py,
                    //     data: data,
                    //     to: 'chat',
                    //     from: 'list',
                    //   });
                    // });
                    // this.props.openChat({
                    //   ...data,
                    //   users: data,
                    // });
                  }}>
                  <View
                    style={{
                      width: Dimensions.get('window').width - 100,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '700',
                      }}
                      numberOfLines={1}>
                      {data?.displayName}
                    </Text>
                    <Button
                      appearance={this.state?.sending ? 'ghost' : 'primary'}
                      onPress={() => {
                        if (!this.state?.sending) {
                          this.setState({sending: true});
                          firestore()
                            .collection('messages')
                            .add({
                              timestamp: new Date().getTime(),
                              users: [this.props.uid, data.uid],
                            })
                            .then((ref) => {
                              ref
                                .collection('messages')
                                .add({
                                  text: 'Hi',
                                  timestamp: new Date().getTime(),
                                  media: null,
                                  gif: null,
                                  sticker: null,
                                  sid: data.uid,
                                  seen: [data.uid],
                                  sent: [data.uid],
                                  reply: null,
                                  reaction: null,
                                })
                                .then((ref_) => {
                                  //   let options = this.props.options
                                  //     ? this.props.options
                                  //     : () => {};
                                  //   this.imageView.measure(
                                  //     (fx, fy, width, height, px, py) => {
                                  //       options({
                                  //         px,
                                  //         py,
                                  //         data: data,
                                  //         to: 'chat',
                                  //         from: 'list',
                                  //       });
                                  //     },
                                  //   );
                                  this.props.openChat({
                                    ...data,
                                    id: ref_.id,
                                    users: [this.props.uid, data.uid],
                                  });
                                });
                            });
                        }
                      }}>
                      {this.state?.sending ? <Spinner /> : 'Send Hi'}
                    </Button>
                  </View>
                </TouchableWithoutFeedback>
              </Layout>
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
export default NewMessage;
