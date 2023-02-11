import {Icon, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Animated, ScrollView, View} from 'react-native';
import {StoryItem} from '@/Components';
import Ripple from 'react-native-material-ripple';
import {LongPressGestureHandler} from 'react-native-gesture-handler';
class StoryList extends React.PureComponent {
  addscroll = new Animated.Value(0);
  addscrollVisible = false;
  render() {
    const {theme, state, t} = this.props;
    return (
      <LongPressGestureHandler>
        <Layout
          style={[
            this.props.theme.Layout.transparent,
            {marginTop: this.props.homePage ? 20 : 0, zIndex: 10},
          ]}>
          {this.props.homePage && (
            <>
              <Animated.View
                style={{
                  opacity: this.props.scrollAnim
                    ? this.props.scrollAnim.interpolate({
                        inputRange: [0, 100, 210],
                        outputRange: [0, 1, 1],
                      })
                    : 0,
                  position: 'absolute',
                  bottom: 10,
                  backgroundColor: theme.Colors.background,
                  elevation: 1,
                }}>
                <StoryItem
                  self
                  image={state.user.current.image}
                  theme={theme}
                />
              </Animated.View>
              <Animated.View
                style={{
                  opacity: this.props.scrollAnim
                    ? this.props.scrollAnim.interpolate({
                        inputRange: [0, 100, 110],
                        outputRange: [1, 0.1, 0],
                      })
                    : 0,
                  transform: [
                    {
                      translateY: this.props.scrollAnim
                        ? this.props.scrollAnim.interpolate({
                            inputRange: [0, 100, 110],
                            outputRange: [0, 10, 10],
                          })
                        : 0,
                    },
                  ],
                }}>
                <Layout
                  style={[
                    this.props.theme.Layout.transparent,
                    {
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginVertical: 5,
                    },
                  ]}>
                  <Text
                    style={{
                      color: theme.Colors.text,
                      fontSize: 23,
                      paddingLeft: 25,
                    }}>
                    {t('Status')}
                  </Text>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateX: this.addscroll.interpolate({
                            inputRange: [0, 1],
                            outputRange: [110, 0],
                          }),
                        },
                      ],
                      opacity: this.addscroll,
                    }}>
                    <Ripple>
                      <View
                        style={{
                          backgroundColor: theme.Colors.primary,
                          borderRadius: 20,
                          padding: 5,
                          paddingHorizontal: 10,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon
                          name="plus-outline"
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: theme.Colors.text,
                          }}
                        />
                        <Text style={{fontSize: 17}}>Add</Text>
                      </View>
                    </Ripple>
                  </Animated.View>
                </Layout>
              </Animated.View>
            </>
          )}
          <Animated.ScrollView
            scrollEventThrottle={16}
            onScroll={(e) => {
              if (
                e.nativeEvent.contentOffset.x >= 60 &&
                !this.addscrollVisible
              ) {
                this.addscrollVisible = true;
                Animated.spring(this.addscroll, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              } else if (
                e.nativeEvent.contentOffset.x < 60 &&
                this.addscrollVisible
              ) {
                this.addscrollVisible = false;
                Animated.spring(this.addscroll, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
              }
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingVertical: 10}}>
            {this.props.homePage && (
              <StoryItem self image={state.user.current.image} theme={theme} />
            )}
            <StoryItem
              image={state.user.current.image}
              name="Nitesh Kumar"
              theme={theme}
            />
            <StoryItem
              image={state.user.current.image}
              name="Nitesh Kumar"
              theme={theme}
            />
            <StoryItem
              image={state.user.current.image}
              name="Nitesh Kumar"
              theme={theme}
            />
            <StoryItem
              image={state.user.current.image}
              name="Nitesh Kumar"
              theme={theme}
            />
            <StoryItem
              image={state.user.current.image}
              name="Nitesh Kumar"
              theme={theme}
            />
          </Animated.ScrollView>
        </Layout>
      </LongPressGestureHandler>
    );
  }
}
export default StoryList;
