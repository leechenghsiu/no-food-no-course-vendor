import React from 'react';
import { View, Platform, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

class OrderedScreen extends React.Component {
  state = {
    meal: '',
    time: '',
    total: '',
    note: ''
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
    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}/order/${currentUser.uid}`);
    let dbMeal = firebase.database().ref(`/users/${currentUser.uid}/order/${currentUser.uid}/meal`);
    try {
      let snapshot = await dbUserid.once('value');
      let mealSnapshot = await dbMeal.once('value');
      let meal = mealSnapshot.val();
      let time = snapshot.val().time;
      let total = snapshot.val().total;
      let note = snapshot.val().note;

      this.setState({ meal, time, total, note }, ()=>console.log(this.state));
    } catch (err) { }
  }

  render() {
    // if(this.state.meal[0]) {
    //   const { meal, time, note, total } = this.state;
    //   const renderMeal = meal.map(meal=>(
    //     <Text key={meal.name}>{`${meal.name} ${meal.price} ${meal.count}`}</Text>
    //   ))

    //   return (
    //     <View style={{flex: 1}}>
    //       {renderMeal}
    //       <Text>{`${time}`}</Text>
    //       <Text>{`${note}`}</Text>
    //       <Text>{`${total}`}</Text>
    //     </View>
    //   )
    // } else {
      return (
        <View style={{flex: 1, padding: 20, backgroundColor: 'rgb(249,249,249)'}}>
          <Text>目前沒有訂單</Text>
        </View>
      )
    // }
  }
}

export default OrderedScreen;
