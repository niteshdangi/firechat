import React from 'react';
import {View, TextInput} from 'react-native';
const style = {
  borderBottomWidth: 2,
  borderBottomColor: '#a9a9a9',
  textAlign: 'center',
  paddingBottom: 3,
  fontSize: 30,
  width: 40,
  marginHorizontal: 5,
};
const OtpInput = ({onSubmitEditing, setOtp, errorotp}) => {
  const o1 = React.useRef();
  const o2 = React.useRef();
  const o3 = React.useRef();
  const o4 = React.useRef();
  const [v1, setv1] = React.useState('');
  const [v2, setv2] = React.useState('');
  const [v3, setv3] = React.useState('');
  const [v4, setv4] = React.useState('');
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <TextInput
        ref={o1}
        style={[style, errorotp ? {borderBottomColor: 'red'} : {}]}
        onChangeText={(value) => {
          setv1(value);
          setOtp(value + v2 + v3 + v4);
          if (value) o2.current.focus();
        }}
        value={v1}
        keyboardType="number-pad"
        maxLength={1}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry
      />
      <TextInput
        ref={o2}
        style={[style, errorotp ? {borderBottomColor: 'red'} : {}]}
        onChangeText={(value) => {
          setv2(value);
          setOtp(v1 + value + v3 + v4);
          if (value) o3.current.focus();
        }}
        keyboardType="number-pad"
        value={v2}
        maxLength={1}
        onKeyPress={(e) => {
          if (e.nativeEvent.key == 'Backspace' && v2 == '') {
            o1.current.focus();
          }
        }}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry
      />
      <TextInput
        ref={o3}
        style={[style, errorotp ? {borderBottomColor: 'red'} : {}]}
        keyboardType="number-pad"
        maxLength={1}
        value={v3}
        onChangeText={(value) => {
          setv3(value);
          setOtp(v1 + v2 + value + v4);
          if (value) o4.current.focus();
        }}
        onKeyPress={(e) => {
          if (e.nativeEvent.key == 'Backspace' && v3 == '') {
            o2.current.focus();
          }
        }}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry
      />
      <TextInput
        ref={o4}
        style={[style, errorotp ? {borderBottomColor: 'red'} : {}]}
        keyboardType="number-pad"
        maxLength={1}
        value={v4}
        onChangeText={(value) => {
          setOtp(v1 + v2 + v3 + value);
          setv4(value);
          //   if (value) o2.current.focus();
        }}
        onKeyPress={(e) => {
          if (e.nativeEvent.key == 'Backspace' && v4 == '') {
            o3.current.focus();
          }
        }}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry
      />
    </View>
  );
};

export default OtpInput;
