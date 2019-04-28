import React from 'react';
import { View, Platform } from 'react-native';
import { Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputBox = ({ label,
   value,
   onChangeText,
   placeholder,
   secureTextEntry,
   autoCorrect,
   autoCapitalize,
   keyboardType,
   errorMessage,
   leftIcon}) => {

   const { inputStyle, inputContainerStyle, containerStyle, labelStyle } = styles;
   const icon = 
      <View style={{justifyContent: 'center', marginLeft: -15, marginRight: 8, width: 30, alignItems: 'center'}}>
         <Ionicons
            name={Platform.OS === "ios" ? `ios-${leftIcon}` : `md-${leftIcon}`}
            color="#FFFFFF"
            size={30}
         />
      </View>

   if (Platform.OS === 'ios') {
      return (
         <Input
            label={label}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor="lightgrey"
            autoCorrect={false}
            inputStyle={inputStyle}
            inputContainerStyle={inputContainerStyle}
            value={value}
            onChangeText={onChangeText}
            errorMessage={errorMessage}
            leftIcon={icon}
            labelStyle={labelStyle}
         />
      );
   }

   return (
      <View style={containerStyle}>
         <Input
            label={label}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor="lightgrey"
            autoCorrect={false}
            inputStyle={inputStyle}
            inputContainerStyle={inputContainerStyle}
            value={value}
            onChangeText={onChangeText}
            errorMessage={errorMessage}
            leftIcon={icon}
            labelStyle={labelStyle}
         />
      </View>
   );
};

const styles = {
   inputStyle: {
      color: 'white',
      fontSize: 18,
      lineHeight: 23
   },
   inputContainerStyle: {
      paddingVertical: 20,
      height: 40,
      flex: 1,
      borderBottomWidth: 2,
      borderColor: 'white'
   },
   containerStyle: {
      borderWidth: 0,
      borderRadius: 5,
      padding: 5,
      justifyContent: 'flex-start',
      flexDirection: 'row',
      borderColor: '#ddd'
   },
   labelStyle: {
      color: 'white'
   }
};

export default InputBox;
