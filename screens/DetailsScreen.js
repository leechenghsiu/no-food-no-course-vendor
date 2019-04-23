import React, { Component } from 'react';
import { ScrollView, View, Text, Platform, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class Details extends Component {
  static navigationOptions = ({navigation}) => {
    const edit = <Ionicons
      name="md-create"
      color="#000"
      size={20}
      style={{padding: 10 }}
      onPress={() => navigation.goBack()}
    />
    return {
      title: '菜單',
      // headerRight: edit
    }
  };

  state = {
    meal:[],
    total: 0,
    loading: false,
    description: '',
    name: '',
    meals:[],
    newMealName: '',
    newMealPrice: ''
  }

  // Add Listener To Refresh
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.setState({meal: []})),
    ]; 
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  async componentWillMount() {
    this.setState({ loading: true });
    const { currentUser } = firebase.auth();
    let dbMenu = firebase.database().ref(`/vendors/${currentUser.uid}`);
    
    try {
      let snapshot = await dbMenu.once('value');
      let description = snapshot.val().description;
      let meals = snapshot.val().meals;
      let username = snapshot.val().username;
      
      this.setState({ description, name: username, meals });
    } catch (err) { }

    this.setState({ loading: false });
  }

  handleAddNew = async () => {
    await this.setState({
      loading: true,
      meals: this.state.meals!==undefined
      ? [ ...this.state.meals,
        { name: this.state.newMealName, price: this.state.newMealPrice }]
      : [{ name: this.state.newMealName, price: this.state.newMealPrice }]
    });
    const { currentUser } = firebase.auth();
    let dbMenu = firebase.database().ref(`/vendors/${currentUser.uid}`);
    await dbMenu.update({ meals: [...this.state.meals] });
    
    this.setState({ loading: false, newMealName: '', newMealPrice: '' }, ()=>console.log(this.state.meals));
  }

  handleSubmit = () => {
    this.props.navigation.navigate('Confirm',{ meal: this.state.meal, name: this.state.name, total: this.state.total })
  }

  handleCount = () => {
    if(!this.state.meal[0]){
      this.setState({
        total: 0
      })
    } else {
      const sum = this.state.meal.map(x => x.price * x.count).reduce((a,b) => a+b);
      this.setState({
        total: sum
      })
    }
  }

  renderInput() {
    return (
      <View style={styles.inputWrapper}>
        <Input
          placeholder="＋新增餐點"
          autoCorrect={false}
          placeholderTextColor="lightgrey"
          inputStyle={styles.inputStyle}
          inputContainerStyle={[styles.inputContainerStyle, {paddingLeft: 20}]}
          containerStyle={[styles.containerStyle, {flex: 3}]}
          onChangeText={newMealName => this.setState({ newMealName })}
          value={this.state.newMealName}
        />
        <Input
          placeholder="金額"
          keyboardType='numeric'
          autoCorrect={false}
          placeholderTextColor="lightgrey"
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          containerStyle={[styles.containerStyle, {flex: 1}]}
          onChangeText={newMealPrice => this.setState({ newMealPrice })}
          value={this.state.newMealPrice}
        />
        <TouchableOpacity style={styles.containerStyle} onPress={this.handleAddNew}>
        { this.state.newMealName !== '' && this.state.newMealPrice !== ''
          ? <Text style={styles.titleStyle}>新增</Text>
          : null
        }
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { name,
            description,
            meals
    } = this.state;

    if (this.state.loading){
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(249,249,249)'}}>
          <ActivityIndicator size='large' />
        </View>
      )
    } else if (this.state.meals===undefined) {
      return (
        <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
          <ScrollView style={{ backgroundColor: 'rgb(249,249,249)' }}>
            <View style={ styles.container }>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.description}>{description}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <Text style={[styles.name, {marginBottom: 20}]}>餐點</Text>
              </View>
              <Text style={styles.description}>目前沒有菜單</Text>
              {this.renderInput()}
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        </View>
      );
    } else {
      const renderMeals = meals.map(meal=>{
        // 增加餐點
        const handleIncreaseMeal = meal => {
          //找到現有的餐點
          if(this.state.meal.find(x => x.name === meal.name)){
            let oldStates = this.state.meal;
            oldStates.find(x => x.name === meal.name).count += 1;
            this.setState({
              meal: [
                ...oldStates
              ]
            },()=>this.handleCount());
          } 
          //第一次出現餐點
          else {
            this.setState({
              meal: [
                ...this.state.meal,
                { name: meal.name, price: meal.price, count: 1 }
              ]
            },()=>this.handleCount())
          }
        }
        // 減少餐點
        const handleDecreaseMeal = meal => {
          //找到現有的餐點
          if(this.state.meal.find(x => x.name === meal.name)){
            let oldStates = this.state.meal;
            if(oldStates.find(x => x.name === meal.name).count === 1){
              oldStates.splice(oldStates.findIndex(x => x.name === meal.name),1)
              this.setState({
                meal: [
                  ...oldStates
                ]
              },()=>this.handleCount());
            } else {
              oldStates.find(x => x.name === meal.name).count -= 1;
              this.setState({
                meal: [
                  ...oldStates
                ]
              },()=>this.handleCount());
            }
          } 
          //第一次出現餐點
          else {
            return null;
          }
        }
        return(
          <View style={styles.meal} key={meal.name}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={[{ marginRight: 6, alignItems: 'flex-end', backgroundColor: '#ff9e81', marginVertical: Platform.OS === "ios"?8:10, height: 16 , borderRadius: 2},this.state.meal.find(x => x.name === meal.name)?{display: 'flex'}:{backgroundColor: 'transparent'}]}>
                <Text style={[styles.mealCount, {lineHeight: Platform.OS === "ios"?16:17}]}>{this.state.meal.find(x => x.name === meal.name)?this.state.meal.find(x => x.name === meal.name).count:''}</Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealPrice}>{`NT$ ${meal.price}`}</Text>
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
              <TouchableOpacity style={styles.addButton} onPress={()=>handleDecreaseMeal(meal)}>
                <Text style={[styles.addButtonText, Platform.OS === "ios" ?{lineHeight: 30}:{lineHeight: 40}]}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={()=>handleIncreaseMeal(meal)}>
                <Text style={[styles.addButtonText, Platform.OS === "ios" ?{lineHeight: 30}:{lineHeight: 40}]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })
      return (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ backgroundColor: 'rgb(249,249,249)' }}>
            <KeyboardAwareScrollView>
              <View style={ styles.container }>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                  <Text style={[styles.name, {marginBottom: 20}]}>餐點</Text>
                  <TouchableOpacity onPress={()=>this.setState({meal: []})} style={{ marginBottom: 20 }}><Text style={{ color: '#ff9e81', fontSize: 18 }}>清除</Text></TouchableOpacity>
                </View>
                {renderMeals}
                {this.renderInput()}
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
          {this.state.meal[0]
            ?<View style={styles.buttonBox}>
              <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
                <View style={{ flex: 1}}></View>
                <Text style={styles.buttonText}>下一步</Text>
                <Text style={styles.buttonPrice}>{`$ ${this.state.total}`}</Text>
              </TouchableOpacity>
            </View>
            :null}
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingBottom: 60
  },
  name: {
    marginLeft: 10,
    fontSize: 24
  },
  description: {
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 30,
    fontSize: 14,
    color: 'rgb(94,94,94)'
  },
  meal: {
    minHeight: 70,
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: 'rgb(151,151,151)',
    paddingTop: 5
  },
  mealCount: {
    color: 'white',
    textAlign: 'center',
    width: 16
  },
  mealName: {
    marginVertical: 8,
    fontSize: 16,
    color: 'rgb(64,64,64)'
  },
  mealPrice: {
    fontSize: 16,
    color: 'rgb(64,64,64)'
  },
  addButton: {
    width: 30,
    height: 30,
    marginLeft: 20,
    borderWidth: 1.5,
    borderColor: 'rgb(151,151,151)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'rgb(151,151,151)',
    fontWeight: '300'
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
    width: '100%',
    height: '100%'
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    padding: 15,
    color: 'white'
  },
  buttonPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 15,
    color: 'white'
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1.5,
    marginTop: 10
  },
  inputContainerStyle: {
    borderBottomWidth: 0
  },
  inputStyle: {
    fontSize: 16,
    color: 'rgb(64,64,64)'
  },
  containerStyle: {
    flex: 1,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  titleStyle: {
    fontSize: 16,
    color: '#ff9e81'
  }
});


export default Details;
