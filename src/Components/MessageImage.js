import React from 'react';
import {Image} from 'react-native';
export default class MessageImage extends React.PureComponent {
  state = {height: this.props.style.height};

  render() {
    Image.getSize(
      this.props.source.uri,
      (w, h) => {
        console.log(w, h);
      },
      (e) => {
        console.log(e);
      },
    );
    return (
      <Image
        {...props}
        style={{...this.props?.style, height: this.state.height}}
      />
    );
  }
}
