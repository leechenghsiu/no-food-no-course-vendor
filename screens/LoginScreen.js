import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import api from '../api'

import InputBox from '../components/InputBox';
import deviceStorage from '../services/deviceStorage';

class LoginScreen extends Component {
  state = {
    email: null,
    password: null,
    error: ' ',
    loading: false,
  };

  onSignIn = async () => {
    const { email, password } = this.state;
    this.setState({ error: ' ', loading: true });
    try {
      // await firebase.auth().signInWithEmailAndPassword(email, password);
      await api.post('vendor/login', {
        email, password
      })
      .then((response) => {
        console.log('Login Success');
        deviceStorage.saveToken("id_token", response.data.token);
        deviceStorage.saveToken("_id", response.data.user._id);

        this.setState({email: '', password: '', loading: false});
        this.props.navigation.navigate('Main');
      })
      .catch((error) => {
        console.log(error);
      });
      
    } catch (err) {
      this.setState({
        email: '',
        password: '',
        error: 'Error!',
        loading: false
      });
    }
  }

  renderButton() {
    const vendorArr = [
      { name: '雲南小廚', email: 'vendor@vendor.com', password: 'vendor' },
      { name: '品客', email: 'vendor2@vendor2.com', password: 'vendor2' },
      { name: '登南派吃守', email: 'vendor3@vendor3.com', password: 'vendor3' },
      { name: '麒耀坊', email: 'vendor4@vendor4.com', password: 'vendor4' },
      { name: '蘋果小屋', email: 'vendor5@vendor5.com', password: 'vendor5' },
      { name: '自助餐', email: 'vendor6@vendor6.com', password: 'vendor6' },
      { name: '呆熊', email: 'vendor7@vendor7.com', password: 'vendor7' }
    ];

    if (this.state.loading) {
      return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
    }

    return (
      <View style={{flex: 1}}>
        <Button
          title='登入'
          raised={true}
          titleStyle={styles.loginButtonTitle}
          buttonStyle={styles.loginButton}
          containerStyle={styles.loginButtonBox}
          onPress={this.onSignIn}
        />
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
          <Text style={styles.signupText}>還沒有帳戶嗎？</Text>
          <Button
            title='立即註冊'
            type="clear"
            titleStyle={styles.signupButtonTitle}
            buttonStyle={styles.signupButton}
            containerStyle={styles.signupButtonBox}
            onPress={()=>this.props.navigation.navigate('Signup')}
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20}}>
          {vendorArr.map(vendor => {
            return (
              <Button
                key={vendor.name}
                title={vendor.name}
                type="clear"
                titleStyle={styles.signupButtonTitle}
                buttonStyle={styles.signupButton}
                containerStyle={[styles.signupButtonBox, { marginTop: 20, marginHorizontal: 10 }]}
                onPress={()=>this.setState({ email: vendor.email, password: vendor.password }, this.onSignIn)}
              />
            )
          })}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Image source={require('../assets/images/logo-full.png')} style={{width: 250, height: 82}}/>
        </View>
        <View style={styles.formStyle}>
          <InputBox
            errorMessage={this.state.error}
            placeholder='請輸入店家信箱'
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            leftIcon="mail"
          />
          <InputBox
            errorMessage={this.state.error}
            secureTextEntry
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='請輸入密碼'
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            leftIcon="lock"
          />
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ff9e81',
    padding: 40
  },
  logoBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
  formStyle: {
    flex: 2,
    alignItems: 'stretch'
  },
  loginButtonTitle: {
    color: '#ff9e81',
    fontWeight: '400'
  },
  loginButton: {
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 5,
    
  },
  loginButtonBox: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 3
  },
  signupText: {
    color: "white"
  },
  signupButtonTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  signupButton: {
    // backgroundColor: 'red'
  },
  signupButtonBox: {
    padding: 0,
    margin: -10
  }
};

export default LoginScreen;
