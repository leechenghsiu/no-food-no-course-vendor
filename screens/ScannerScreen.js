import React from 'react';
import { View, Platform, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

class ScannerScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    saving: false,
    username: '',
    balance: '',
    uid: '',
    orderId: ''
  }
  
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;

    const close = <Ionicons
      name={Platform.OS === "ios" ? "ios-close" : "md-close"}
      color="#ffffff"
      size={40}
      onPress={() => this.props.navigation.goBack()}
    />

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    if (this.state.saving) {
      return (
        <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent:'center', alignItems: 'center' }}>
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
        <View style={{position: 'absolute', top: 30, left: 15}}>{close}</View>
      </View>
    );
  }

  handleBarCodeScanned = async ({ data }) => {
    const { name, balance, uid, orderId } = JSON.parse(data);
    // 判斷兩種情況
    if(this.props.navigation.state.params) {
      await this.setState({
        username: name,
        balance: balance - this.props.navigation.state.params.total,
        uid: uid,
        orderId: ''
      },()=>console.log(this.state))
    } else {
      await this.setState({
        username: name,
        balance: '',
        uid: uid,
        orderId: orderId
      },()=>console.log(this.state))
    }
    
    // 掃描後扣款
    this.handleBalance();
  }

  handleBalance = async () => {
    this.setState({ saving: true });

    const { balance, uid, orderId } = this.state;
    const { currentUser } = firebase.auth();
    //掃到餐點改成完成
    if(this.state.orderId!=='' && this.state.balance===''){
      let dbOrderid = await firebase.database().ref(`/users/${uid}/order/${orderId}`);
      let dbVendorid = await firebase.database().ref(`/vendors/${currentUser.uid}/order/${orderId}`);
      await dbOrderid.update({ finish: true });
      await dbVendorid.update({ finish: true });
    } 
    //掃到 QRCode 扣款
    else if (this.state.orderId==='' && this.state.balance!=='') {
      let dbUserid = await firebase.database().ref(`/users/${uid}`);
      await dbUserid.update({ balance });
    }

    this.setState({ saving: false }, ()=>{this.props.navigation.goBack(); this.props.navigation.navigate('Ordered')});
  }
}

export default ScannerScreen;