import React from 'react';
import { View, Platform, Text, StatusBar, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';

import api from '../api';
import deviceStorage from '../services/deviceStorage';

class ConfirmScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const back = <Ionicons
      name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
      color="#000"
      size={30}
      style={{padding: 10 }}
      onPress={() => navigation.goBack()}
    />

    return {
      title: "餐點",
      headerLeft: back
    }
  }
  
  constructor(props) {
    super(props);
    this.state = {
      orderLength: '',
      saving: false,
      note: '',
      balance: '',
      payment: 'card',
      hour: (new Date().getHours() < 10) ? `0${new Date().getHours()}` : new Date().getHours(),
      minute: (new Date().getMinutes() < 10) ? `0${new Date().getMinutes()}` : new Date().getMinutes()
    }
  }

  async componentWillMount() {
    const userId = await AsyncStorage.getItem('_id');
    try {
      await api.get(`orders/vendor/${userId}`)
      .then((response) => {
        console.log('Find Order');
        // 現場編號
        const orderLength = response.data.order.length % 100 + 1;
        if(orderLength < 10) {
          this.setState({ orderLength: `00${orderLength}` },()=>console.log(this.state.orderLength));
        } else if (orderLength >= 10 && orderLength < 100) {
          this.setState({ orderLength: `0${orderLength}` },()=>console.log(this.state.orderLength));
        } else if (orderLength === 100) {
          this.setState({ orderLength },()=>console.log(this.state.orderLength));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    } catch (err) { }
  }

  handlePress = type => {
    type === 'cash' ? this.setState({payment: 'cash'}) : this.setState({payment: 'card'})
  }

  handleSubmit = async () => {
    if(this.state.payment==='card'){
      this.props.navigation.navigate('Scanner', {
        total: this.props.navigation.state.params.total,
        meal: this.props.navigation.state.params.meal,
        name: this.props.navigation.state.params.name,
        orderLength: this.state.orderLength,
        remark: this.state.note
      })
    } else {
      this.setState({ saving: true });

      // const { currentUser } = firebase.auth();
      const { meal, total, name } = this.props.navigation.state.params;
      const { hour, minute, orderLength, note } = this.state;
      const vendorId = await AsyncStorage.getItem('_id');
      // let dbVendor = firebase.database().ref(`/vendors/${currentUser.uid}/order`).push();
      
      // // push 訂單到店家
      // await dbVendor.set({ meal: [...meal], time: `${hour}:${minute}`, note: '', total, vendor: `${name}`, finish: true, name: '現場：現金' });
      
      // 下訂單
      await api.post('orders', {
        list: [...meal],
        hour,
        minute,
        total,
        remark: note,
        orderNumber: orderLength,
        status: true,
        vendor: { vendorId, vendorname: name },
        user: { userId: vendorId, username: '現場：現金' }
      })
      .then((response) => {
        console.log(response);
        // this.setState({ meals: [...response.data] });
        // console.log(this.state.meals)
      })
      .catch((error) => {
        console.log(error);
        console.log('error');
      });

      this.setState({ saving: false });
      this.props.navigation.navigate('Ordered');
    }
  }

  renderButton() {
    if(this.state.saving) {
      return (
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
            <ActivityIndicator size='small' />
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.buttonBox}>
        <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>結帳</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { meal, name, total } = this.props.navigation.state.params;
    
    const renderMeal = meal.map(meal=>(
      <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }} key={meal.product}>
        <View style={{ marginRight: 6, alignItems: 'flex-end', backgroundColor: '#ff9e81', marginVertical: Platform.OS === "ios"?0:2, height: 16 , borderRadius: 2 }}>
          <Text style={[styles.mealCount, {lineHeight: Platform.OS === "ios"?16:17}]}>{meal.quantity}</Text>
        </View>
        <View style={{ flex: 5 }}>
          <Text style={styles.mealName}>{meal.product}</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={styles.mealPrice}>{`NT$ ${meal.price}`}</Text>
        </View>
      </View>
    ))
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: 'white' }}>
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />
          <KeyboardAwareScrollView>
            <View style={styles.container}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 1, borderBottomWidth: 1}}>
                  <Text style={styles.title}>{name}</Text>
                </View>
                <View style={{flex: 1}}></View>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>餐點</Text>
                {renderMeal}
                <View style={styles.boxTotal}>
                  <Text style={styles.boxTotalContent}>小計</Text>
                  <Text style={styles.boxTotalContent}>{`NT$ ${total}`}</Text>
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>付款方式</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20}}>
                  <Text style={{fontSize: 20, color: this.state.payment==='card'?'black':'lightgrey'}} onPress={()=>this.handlePress('card')}>悠遊卡</Text>
                  <Text style={{fontSize: 20, color: this.state.payment==='cash'?'black':'lightgrey'}} onPress={()=>this.handlePress('cash')}>現金</Text>
                </View>
              </View>
              <View style={[styles.box, {borderBottomWidth: 0, height: 200}]}>
                  <Text style={styles.boxTitle}>備註</Text>
                  <TextInput
                    style={styles.addNote}
                    autoCorrect={false}
                    onChangeText={note => this.setState({note})}
                  />
                </View>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>      
        {this.renderButton()}
      </View>
    )
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    paddingVertical: 15
  },
  box: {
    flex: 1,
    minHeight: 150,
    paddingTop: 20,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderColor: 'rgb(151,151,151)'
  },
  boxTitle: {
    fontSize: 20,
    marginBottom: 10
  },
  mealCount: {
    color: 'white',
    textAlign: 'center',
    width: 16
  },
  mealName: {
    color: 'rgb(64,64,64)',
    fontSize: 16
  },
  mealPrice: {
    textAlign: 'right',
    color: 'rgb(64,64,64)'
  },
  boxImage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  boxTotal: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgb(151,151,151)',
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    textAlign: 'right'
  },
  boxTotalContent: {
    fontSize: 16
  },
  timePicker: {
    height: 100,
    overflow: 'hidden'
  },
  timePickerAndroid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 50
  },
  timePickerAndroidText: {
    fontSize: 30,
    color: 'rgb(64,64,64)'
  },
  addNote: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(64,64,64)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'rgb(64,64,64)',
    fontSize: 14,
    borderRadius: 5
  },
  buttonBox: {
    backgroundColor: '#ff9e81',
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    padding: 15,
    color: 'white'
  }
})

export default ConfirmScreen;
