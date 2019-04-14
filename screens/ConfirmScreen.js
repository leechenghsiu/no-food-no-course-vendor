import React from 'react';
import { View, Platform, Text, StatusBar, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Image, DatePickerIOS, TimePickerAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
      saving: false,
      chosenTime: new Date(),
      hour: 12,
      minute: `00`,
      note: ''
    }
    this.setTime = this.setTime.bind(this);
  }

  state = {
    balance: ''
  }

  setTime(newTime) {
    const h = (newTime.getHours() < 10) ? `0${newTime.getHours()}` : newTime.getHours();
    const m = (newTime.getMinutes() < 10) ? `0${newTime.getMinutes()}` : newTime.getMinutes();
    this.setState({chosenTime: newTime, hour: h, minute: m});
  }

  setTimeAndroid = async () => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: 12,
        minute: 0,
        is24Hour: false
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        const h = (hour < 10) ? `0${hour}` : hour;
        const m = (minute < 10) ? `0${minute}` : minute;
        this.setState({hour: h, minute: m});
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  handleSubmit = () => {
    this.props.navigation.navigate('Scanner', {total: this.props.navigation.state.params.total});
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
      <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }} key={meal.name}>
        <View style={{ marginRight: 6, alignItems: 'flex-end', backgroundColor: '#ff9e81', marginVertical: Platform.OS === "ios"?0:2, height: 16 , borderRadius: 2 }}>
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
                  <Text style={{fontSize: 20, color: 'lightgrey'}}>現金</Text>
                  <Text style={{fontSize: 20, color: 'black'}}>悠遊卡</Text>
                </View>
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
