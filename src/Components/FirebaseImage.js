import {useTheme} from '@/Theme';
import storage from '@react-native-firebase/storage';

import React, {Component} from 'react';
import {Image} from 'react-native';
import {connect} from 'react-redux';
import Firebase from '../Store/Image/Firebase';
class FirebaseImage extends Component {
  getimg = async () => {
    try {
      if (this.props.url) {
        const url = await storage().ref(this.props.url).getDownloadURL();
        this.setImage({url: this.props.url, firebase: {uri: url}});
      }
    } catch (e) {
      console.log(e);
      if (this.props.default)
        this.setImage({url: this.props.url, firebase: this.props.default});
    }
  };
  setImage(image) {
    this.props.dispatch(Firebase.action(image));
  }
  componentDidMount() {
    this.getimg();
  }
  shouldComponentUpdate(p, s) {
    if (p.images?.[p.url] != this.props.images?.[this.props.url]) return true;
    return false;
  }
  render() {
    const image = this.props.images?.[this.props.url]
      ? this.props.images?.[this.props.url]
      : null;
    // console.log(image);
    return <Image {...this.props} source={image} />;
  }
}
function mapStateToProps(state) {
  const {image} = state;
  return {images: image.images};
}
export default connect(mapStateToProps)(FirebaseImage);
