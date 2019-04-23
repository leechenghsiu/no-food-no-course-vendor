import React, { Component } from 'react';
import { View, Platform, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import InputBox from '../components/InputBox';

class SignupScreen extends React.Component {
  state = {
    email: null,
    password: null,
    phone: null,
    username: null,
    description: null,
    opening: null,
    balance: 0,
    error: ' ',
    loading: false
  };

  onCreateUser = async () => {
    this.setState({ error: ' ', loading: true });
    const { email, password, phone, username, opening, balance, description } = this.state;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const { currentUser } = firebase.auth();
      let dbUserid = firebase.database().ref(`/vendors/${currentUser.uid}`);
      this.setState({ username, email, phone, opening, balance, description },()=>firebase.auth().signInWithEmailAndPassword(email, password));
      if(username!==null&&opening!==null&&phone!==null) {
        await dbUserid.set({ email, phone, username, opening, balance, description });
        this.setState({email: '', password: '', loading: false});
        this.props.navigation.navigate('Main');
      } else throw err

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
    if (this.state.loading) {
      return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
    }

    return (
      <View style={styles.formStyle}>
        <Button
          title='立即註冊'
          raised={true}
          titleStyle={styles.signupButtonTitle}
          buttonStyle={styles.signupButton}
          containerStyle={styles.signupButtonBox}
          onPress={this.onCreateUser}
        />
        <Button
          title="取消"
          raised={true}
          titleStyle={styles.cancelButtonTitle}
          buttonStyle={styles.cancelButton}
          containerStyle={styles.cancelButtonBox}
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ff9e81'}} forceInset={{ top: 'always' }}>
        <View style={styles.container}>
          <KeyboardAwareScrollView style={{paddingHorizontal: 40}}>
            <Text style={styles.title}>註冊</Text>
            <InputBox
              label='學校信箱'
              errorMessage={this.state.error}
              placeholder='vendor@vendor.com'
              autoCorrect={false}
              autoCapitalize='none'
              keyboardType='email-address'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              leftIcon="mail"
            />
            <InputBox
              label='密碼'
              errorMessage={this.state.error}
              secureTextEntry
              autoCorrect={false}
              autoCapitalize='none'
              placeholder='password'
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              leftIcon="lock"
            />
            <InputBox
              label='店家名稱'
              errorMessage={this.state.error}
              autoCorrect={false}
              placeholder='曾記麻糬'
              value={this.state.username}
              onChangeText={username => this.setState({ username })}
              leftIcon="person"
            />
            <InputBox
              label='店家簡介'
              errorMessage={this.state.error}
              autoCorrect={false}
              placeholder='正宗麻糬在此'
              value={this.state.description}
              onChangeText={description => this.setState({ description })}
              leftIcon="book"
            />
            <InputBox
              label='電話'
              errorMessage={this.state.error}
              autoCorrect={false}
              placeholder='0223456789'
              value={this.state.phone}
              onChangeText={phone => this.setState({ phone })}
              leftIcon="phone-portrait"
            />
            <InputBox
              label='營業時間'
              errorMessage={this.state.error}
              autoCorrect={false}
              placeholder='11:00~19:00'
              value={this.state.opening}
              onChangeText={opening => this.setState({ opening })}
              leftIcon="clock"
            />
          {this.renderButton()}
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9e81',
  },
  title: {
    fontSize: 48,
    color: 'white',
    fontWeight: '500',
    paddingVertical: 30,
    paddingHorizontal: 10
  },
  signupButtonTitle: {
    color: '#ff9e81',
    fontWeight: '400'
  },
  signupButton: {
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 5
  },
  signupButtonBox: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 3
  },
  cancelButtonTitle: {
    color: '#f9f9f9',
    fontWeight: '400'
  },
  cancelButton: {
    backgroundColor: '#f96b40',
    borderRadius: 5,
    paddingVertical: 10
  },
  cancelButtonBox: {
    marginHorizontal: 10,
    marginVertical: 10,
    //
  },
})

export default SignupScreen;
