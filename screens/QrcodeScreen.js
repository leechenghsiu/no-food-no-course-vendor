import React from 'react';
import { View, Text, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

import QrcodeApi from '../api/QrcodeApi';

class QrcodeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const back = <Ionicons
      name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
      color="#007AFF"
      size={25}
      style={{padding: 10 }}
      onPress={() => navigation.goBack()}
    />

    return {
      // headerTransparent: true,
      headerLeft: (
        back
      )
    }
  };

  state = {
    username: '',
    balance: ''
  };

  async componentDidMount() {
    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    try {
      let snapshot = await dbUserid.once('value');
      let username = snapshot.val().username;
      let balance = snapshot.val().balance;
      this.setState({ username, balance });
    } catch (err) { }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <QrcodeApi />
        <Text>{`${this.state.username} ${this.state.balance}`}</Text>
      </View>
    )
  }
}

export default QrcodeScreen;
