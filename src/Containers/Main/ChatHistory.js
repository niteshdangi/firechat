import {Button, Icon, Layout} from '@ui-kitten/components';
import React, {Component, PureComponent} from 'react';
import {Animated, Dimensions, Image, Text, View} from 'react-native';
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {Message} from '@/Components';
class ChatHistory extends Component {
  data = this.props.data;
  _scrollview = React.createRef();
  shouldComponentUpdate(p, s) {
    return p.data !== this.props.data;
  }
  setNativeProps(props) {
    // this._scrollview.current?.setNativeProps(props);
  }
  render() {
    const {data} = this.props;
    return (
      // <FlatList
      //   ref={this._scrollview}
      //   // inverted
      //   style={{transform: [{scale: -1}]}}
      //   data={data}
      //   // nestedScrollEnabled
      //   initialNumToRender={50}
      //   keyExtractor={(item) => item.id}
      //   renderItem={(props) => {
      //     return (

      //     );
      //   }}
      // />
      <ScrollView style={{transform: [{scale: -1}]}}>
        {data.map((value, index) => (
          <View
            style={{
              marginBottom: index == data.length - 1 ? 20 : 0,
            }}>
            <Message
              id={index}
              showMessageOptions={this.props.showMessageOptions}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
}
export default ChatHistory;
