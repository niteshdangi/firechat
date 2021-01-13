import {Icon, Input, Layout, Spinner, Text} from '@ui-kitten/components';
import React, {PureComponent} from 'react';
import {Dimensions} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import Image from 'react-native-image-progress';
import Ripple from 'react-native-material-ripple';

// import * as MediaLibrary from 'expo-media-library';
// import * as Permissions from 'expo-permissions';
export default class Giphy extends PureComponent {
  state = {
    data: [],
    gallery: [],
    type: 'stickers',
    loading: true,
    uid: this.props?.uid,
  };

  getGiphyTrend() {
    fetch(
      'https://api.giphy.com/v1/' +
        this.state.type +
        '/trending?api_key=BLp12AJExkJK21EMAJeLxSF6IS3YgTwP',
      {
        method: 'GET',
      },
    )
      .then((response) => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(([statusCode, data]) => {
        this.setState({data: data.data, loading: false});
      })
      .catch(() => {
        this.setState({loading: false});
      });
  }
  search(value) {
    if (value)
      fetch(
        'https://api.giphy.com/v1/' +
          this.state.type +
          '/search?api_key=BLp12AJExkJK21EMAJeLxSF6IS3YgTwP&q=' +
          value +
          '&random_id=' +
          this.state.uid,
        {
          method: 'GET',
        },
      )
        .then((response) => {
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]);
        })
        .then(([statusCode, data]) => {
          this.setState({data: data.data});
        })
        .catch(() => {});
    else this.getGiphyTrend();
  }
  componentDidMount() {
    // this.loadGallery();
    this.getGiphyTrend();
  }
  modal = React.createRef();
  render() {
    return (
      <Modalize
        ref={this.modal}
        HeaderComponent={
          <Layout style={{...this.props.theme.Colors.background}}>
            {this.state.type === 'gallery' ? (
              <Text
                style={{
                  margin: 5,
                  borderRadius: 20,
                  marginTop: 10,
                  marginLeft: 20,
                  color: this.props.theme.Colors.text,
                }}
                category="h6">
                Gallery
              </Text>
            ) : (
              <Input
                textStyle={{...this.props.theme.color}}
                style={{
                  margin: 5,
                  borderRadius: 20,
                  marginTop: 10,
                  borderColor: this.props.theme.Colors.background,
                  //   ...this.props.theme.bgLight,
                }}
                placeholderTextColor={this.props.theme.Colors.placeholder}
                placeholder="Search Giphy"
                onChangeText={(value) => this.search(value)}
              />
            )}
          </Layout>
        }
        FloatingComponent={
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 2,
              borderTopWidth: 1,
              borderColor: this.props.theme.Colors.background,
              zIndex: 10000000000000000,
              backgroundColor: this.props.theme.Colors.inputBackground,
              position: 'absolute',
              top: Dimensions.get('window').height - 45,
              //   ...this.props?.theme?.bg,
            }}>
            <Ripple
              onPress={() => {
                if (this.state.type !== 'gallery') {
                  this.setState({type: 'gallery'});
                  //   if (this.state.gallery.length === 0) this.loadGallery();
                }
              }}
              style={{
                width: Dimensions.get('window').width / 3,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Icon
                name="image-outline"
                style={{
                  width: 25,
                  height: 25,
                  tintColor:
                    this.state.type == 'gallery'
                      ? 'orange'
                      : this.props.theme.Colors.text,
                }}
              />
            </Ripple>
            <Ripple
              onPress={() => {
                if (this.state.type !== 'stickers') {
                  this.setState({type: 'stickers', data: []});
                  this.getGiphyTrend();
                }
              }}
              style={{
                width: Dimensions.get('window').width / 3,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Icon
                name="smiling-face-outline"
                style={{
                  width: 25,
                  height: 25,
                  tintColor:
                    this.state.type == 'stickers'
                      ? 'orange'
                      : this.props.theme.Colors.text,
                }}
              />
            </Ripple>
            <Ripple
              onPress={() => {
                if (this.state.type !== 'gifs') {
                  this.setState({type: 'gifs', data: []});
                  this.getGiphyTrend();
                }
              }}
              style={{
                width: Dimensions.get('window').width / 3,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Icon
                name="smiling-face-outline"
                style={{
                  width: 25,
                  height: 25,
                  tintColor:
                    this.state.type == 'gifs'
                      ? 'orange'
                      : this.props.theme.Colors.text,
                }}
              />
            </Ripple>
          </Layout>
        }
        snapPoint={Dimensions.get('screen').height / 2 + 50}
        modalStyle={{
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
        }}
        closeSnapPointStraightEnabled={false}
        rootStyle={{
          elevation: 5,
          zIndex: 100000,
        }}
        flatListProps={{
          data:
            this.state.type === 'gallery'
              ? this.state.gallery
              : this.state.data,
          onEndReached: () => {
            // this.state.type === 'gallery' ? this.loadMore() : null;
          },
          //   style: {...this.props.theme.bgLight},
          renderItem: ({item, index}) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                this.modal.current.close();
                this.props?.send({
                  type: this.state.type,
                  url:
                    this.state.type === 'gallery'
                      ? {...item}
                      : item.images.fixed_width.url,
                });
                if (this.state.type !== 'gallery') {
                  fetch(item.analytics.onclick.url, {
                    method: 'GET',
                  });
                  fetch(item.analytics.onsent.url, {
                    method: 'GET',
                  });
                }
              }}
              style={{
                borderRadius: this.state.type === 'stickers' ? 0 : 10,
                overflow: 'hidden',
                elevation: this.state.type === 'stickers' ? 0 : 2,
                margin: 10,
                backgroundColor:
                  this.state.type === 'stickers' ? 'transparent' : '#000',
              }}>
              <Image
                indicator={Spinner}
                indicatorProps={{
                  size: 30,
                  borderWidth: 0,
                  color: 'rgba(150, 150, 150, 1)',
                  unfilledColor: 'rgba(200, 200, 200, 0.2)',
                }}
                key={index}
                source={{
                  uri:
                    this.state.type === 'gallery'
                      ? item.uri
                      : item.images.fixed_width.url,
                }}
                onload={() => {
                  !this.state.type === 'gallery' &&
                    fetch(item.analytics.onload.url, {
                      method: 'GET',
                    });
                }}
                style={{
                  width:
                    this.state.type === 'stickers'
                      ? Dimensions.get('screen').width / 3 - 20
                      : Dimensions.get('screen').width / 2 - 20,
                  height:
                    this.state.type === 'stickers'
                      ? Dimensions.get('screen').width / 3 - 20
                      : Dimensions.get('screen').width / 2 - 20,
                }}
                resizeMode={
                  this.state.type === 'stickers' ? 'contain' : 'contain'
                }
              />
              {this.state.type === 'gallery'
                ? item.mediaType === 'video' && (
                    <Layout
                      style={{
                        position: 'absolute',
                        bottom: 5,
                        left: 5,
                        padding: 5,
                        backgroundColor: 'blue',
                        borderRadius: 50,
                        zIndex: 100,
                        elevation: 2,
                      }}>
                      <Icon
                        name="video-outline"
                        style={{width: 25, height: 25, tintColor: '#fff'}}
                      />
                    </Layout>
                  )
                : null}
            </TouchableWithoutFeedback>
          ),
          numColumns: this.state.type === 'stickers' ? 3 : 2,
          key: this.state.type === 'stickers' ? 3 : 2,
          initialNumToRender: 8,
          ListEmptyComponent: (
            <Layout
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 150,
                backgroundColor: 'transparent',
              }}>
              <Spinner />
            </Layout>
          ),
        }}
      />
    );
  }
}
class GiphyItem extends PureComponent {
  render() {
    const {item} = this.props;
    return (
      <Layout
        style={{
          borderWidth: 1,
          width: Dimensions.get('screen').width / 2,
          height: Dimensions.get('screen').width / 2,
        }}>
        <Image
          source={{uri: item.images.original.webp}}
          style={{
            width: Dimensions.get('screen').width / 2,
            height: Dimensions.get('screen').width / 2,
          }}
          resizeMode="cover"
        />
      </Layout>
    );
  }
}
