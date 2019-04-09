import React from 'react';
import { View, Platform, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

class ScannerScreen extends React.Component {
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
      title: 'QR Code 掃瞄器',
      headerLeft: (
        back
      )
    }
  };

  state = {
    hasCameraPermission: null,
    saving: false,
    username: '',
    balance: '',
    uid: ''
  }
  
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    if (this.state.saving) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
          //判斷是否屬於 QR Code
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        </View>
        <View style={{ flex: 3, backgroundColor: 'transparent' }}>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        </View>
      </View>
    );
  }

  handleBarCodeScanned = async ({ data }) => {
    await this.setState({
      username: JSON.parse(data).name,
      balance: JSON.parse(data).balance - this.props.navigation.state.params.total,
      uid: JSON.parse(data).uid
    })
    // 掃描後扣款
    this.handleBalance();
  }

  handleBalance = async () => {
    this.setState({ saving: true });

    const { balance, uid } = this.state;
    let dbUserid = await firebase.database().ref(`/users/${uid}`);
    await dbUserid.update({ balance });

    this.setState({ saving: false }, ()=>this.props.navigation.navigate('Ordered'));
  }
}

export default ScannerScreen;