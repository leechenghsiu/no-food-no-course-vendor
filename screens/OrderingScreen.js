import React from 'react';
import { View, Platform, Text, ScrollView, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

import api from '../api';
import deviceStorage from '../services/deviceStorage';

class OrderingScreen extends React.Component {
  state = {
    orders: [],
    loading: false,
    nothing: false
  }

  // Add Listener To Refresh
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.componentWillMount()),
    ]; 
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  async componentWillMount() {
    this.setState({ loading: true });
    const userId = await AsyncStorage.getItem('_id');

    try {
      console.log(userId);
      await api.get(`orders/vendor/${userId}`)
      .then((response) => {
        console.log(response.data.order);
        response.data.order.sort((a, b) => a - b).reverse();
        this.setState({ orders: [...response.data.order] });
        console.log(this.state.orders)
      })
      .catch((error) => {
        console.log(error);
      });

    } catch (err) { this.setState({ nothing: true }) }

    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1, padding: 20, backgroundColor: 'rgb(249,249,249)', justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large"/>
        </View>
      )
    }
    if (this.state.orders.filter(order=>order.status===false).length<1 || this.state.nothing===true) {
        return (
          <View style={{flex: 1, padding: 20, backgroundColor: 'rgb(249,249,249)'}}>
            <Text>目前沒有訂單</Text>
          </View>
        )
    } else {
      const renderOrder = this.state.orders.filter(order=>order.status===false).map((order,index)=>{
        // const mealToArray = Object.values(order.meal);
        const renderMeal = order.list.map(meal=>(
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
        return(
          <View style={[styles.order, index===0?{marginTop: 20}:null ]} key={order._id}>
            <View style={styles.orderTop}>
              <Text style={styles.vendor}>{`${order.user.username}`}</Text>
              <View style={styles.timeBox}>
                <Text style={[styles.time, {fontSize: 12}]}>取餐時間</Text>
                <Text style={styles.time}>{`${order.hour}:${order.minute}`}</Text>
              </View>
            </View>

            <View style={styles.orderBottom}>
              <Text style={styles.title}>餐點</Text>
              {renderMeal}
              <View style={styles.total}>
                <Text style={styles.totalContent}>小計</Text>
                <Text style={styles.totalContent}>{`NT$ ${order.total}`}</Text>
              </View>
            </View>

            <View style={styles.orderBottom}>
              <Text style={styles.title}>備註</Text>
              <View style={styles.note}>
                <Text style={{color: 'rgb(64,64,64)'}}>{`${order.remark}`}</Text>
              </View>
            </View>
          </View>
        )
    })
    return (
      <ScrollView style={styles.container}>
        {renderOrder}
      </ScrollView>
    )
  }
}}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(249,249,249)',
    paddingHorizontal: 25
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
  order: {
    backgroundColor: 'white',
    width: '100%',
    minHeight: 300,
    shadowOffset: { width: 2, height: 5 },
    shadowColor: 'rgba(0, 0, 0, .12)',
    shadowOpacity: 0.5,
    elevation: 1,
    paddingBottom: 10,
    marginBottom: 20
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    height: 54
  },
  vendor: {
    paddingTop: 15,
    paddingLeft: 15,
    fontSize: 28
  },
  timeBox: {
    width: 87,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9e81'
  },
  time: {
    fontSize: 24,
    alignItems: 'center',
    color: 'white'
  },
  orderBottom: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  total: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgb(151,151,151)',
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  totalContent: {
    fontSize: 16
  },
  note: {
    borderBottomWidth: 1,
    borderColor: 'rgb(151,151,151)',
    paddingBottom: 10
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30
  },
  orderButtonTitle: {
    color: 'black',
    fontWeight: '300'
  },
  orderButton: {
    backgroundColor: 'rgb(234,234,234)',
    width: 100
  },
  orderButtonBox: {
    paddingVertical: 3
  },
})

export default OrderingScreen;
