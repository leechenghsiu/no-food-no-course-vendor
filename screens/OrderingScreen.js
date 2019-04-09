import React from 'react';
import { View, Platform, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import { Button } from 'react-native-elements';

class OrderingScreen extends React.Component {
  state = {
    meal: [],
    time: '',
    total: '',
    note: '',
    vendor: '',
    loading: false
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

    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/vendors/${currentUser.uid}/order/TmaUZkP0nAQUH2JOoaadr4jVtPd2`);
    let dbMeal = firebase.database().ref(`/vendors/${currentUser.uid}/order/TmaUZkP0nAQUH2JOoaadr4jVtPd2/meal`);
    try {
      let snapshot = await dbUserid.once('value');
      let mealSnapshot = await dbMeal.once('value');
      let meal = mealSnapshot.val();
      let time = snapshot.val().time;
      let total = snapshot.val().total;
      let note = snapshot.val().note;
      let vendor = snapshot.val().vendor;

      this.setState({ meal, time, total, note, vendor });
    } catch (err) { }

    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading){
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
      )
    } else if (!this.state.meal[0]) {
      return (
        <View style={{flex: 1, padding: 20, backgroundColor: 'rgb(249,249,249)'}}>
          <Text>目前沒有訂單</Text>
        </View>
      )
    } else {
      const { meal, time, note, total, vendor } = this.state;
      
      const renderMeal = meal.map(meal=>(
        <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }} key={meal.name}>
          <View style={{ marginRight: 6, alignItems: 'flex-end', backgroundColor: 'rgb(141,216,227)', marginVertical: Platform.OS === "ios"?0:2, height: 16 , borderRadius: 2 }}>
            <Text style={[styles.mealCount, {lineHeight: Platform.OS === "ios"?16:17}]}>{meal.count}</Text>
          </View>
          <View style={{ flex: 5 }}>
            <Text style={styles.mealName}>{meal.name}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.mealPrice}>{`NT$ ${meal.price}`}</Text>
          </View>
        </View>
      ))

      return (
        <ScrollView style={styles.container}>
          <View style={styles.order}>
            <View style={styles.orderTop}>
              <Text style={styles.vendor}>{`${vendor}`}</Text>
              <View style={styles.timeBox}>
                <Text style={[styles.time, {fontSize: 12}]}>取餐時間</Text>
                <Text style={styles.time}>{`${time}`}</Text>
              </View>
            </View>

            <View style={styles.orderBottom}>
              <Text style={styles.title}>餐點</Text>
              {renderMeal}
              <View style={styles.total}>
                <Text style={styles.totalContent}>小計</Text>
                <Text style={styles.totalContent}>{`NT$ ${total}`}</Text>
              </View>
            </View>

            <View style={[styles.orderBottom, {}]}>
              <Text style={styles.title}>備註</Text>
              <View style={styles.note}>
                <Text style={{color: 'rgb(64,64,64)'}}>{`${note}`}</Text>
              </View>
            </View>

            <View style={styles.button}>
              <Button
                title="核對身份"
                titleStyle={styles.orderButtonTitle}
                buttonStyle={styles.orderButton}
                containerStyle={styles.orderButtonBox}
                onPress={()=>null}
              />
            </View>
          </View>
        </ScrollView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(249,249,249)',
    padding: 25
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
    paddingBottom: 10
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
    backgroundColor: 'rgb(141,216,227)'
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
