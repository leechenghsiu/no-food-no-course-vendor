import React from 'react';
import { View, Platform, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

class ScannerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      hasCameraPermission: null,
      saving: false,
      username: '',
      balance: '',
      uid: '',
      orderId: '',
      vendor: '',
      hour: (new Date().getHours() < 10) ? `0${new Date().getHours()}` : new Date().getHours(),
      minute: (new Date().getMinutes() < 10) ? `0${new Date().getMinutes()}` : new Date().getMinutes()
    }
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

    const { balance, uid, orderId, hour, minute } = this.state;
    const { currentUser } = firebase.auth();
    //掃到餐點改成完成
    if(this.state.orderId!=='' && this.state.balance===''){
      let dbOrderid = await firebase.database().ref(`/users/${uid}/order/${orderId}`);
      let dbVendorid = await firebase.database().ref(`/vendors/${currentUser.uid}/order/${orderId}`);
      await dbOrderid.update({ finish: true });
      await dbVendorid.update({ finish: true });
      // Works on both iOS and Android
      Alert.alert(
        `${this.state.username}來取餐了`,
        '',
        [
          {text: '確認', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
      this.setState({ saving: false });
    } 
    //掃到 QRCode 扣款
    else if (this.state.orderId==='' && this.state.balance!=='') {
      const { currentUser } = firebase.auth();
      const { meal, total, name } = this.props.navigation.state.params;
      let dbBalance = await firebase.database().ref(`/users/${uid}`);
      let dbVendor = firebase.database().ref(`/vendors/${currentUser.uid}/order`).push();
      let dbUserid = firebase.database().ref(`/users/${uid}/order/${dbVendor.key}`);
      
      // 店家和 User 都要 push 訂單
      await dbVendor.set({ meal: [...meal], time: `${hour}:${minute}`, note: '', total, vendor: `${name}`, finish: true, name: '現場：黑白Pay' });
      await dbUserid.set({ meal: [...meal], time: `${hour}:${minute}`, note: '', total, vendor: `${name}`, finish: true, name: '現場：黑白Pay' });
      
      await dbBalance.update({ balance });
      this.setState({ saving: false });
    }

    this.props.navigation.goBack();
    this.props.navigation.navigate('Ordered');
  }
}

export default ScannerScreen;