import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';

import vendors from '../json/vendors.json';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.42;

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: '店家'
  };

  state = { vendors: [] };

  componentWillMount() {
    this.setState({ vendors });
  }

  goToPageTwo = (vendor) => {
    this.props.navigation.navigate('Details', { ...vendor });
  };

  render() {
    return (
      <ScrollView style={{ backgroundColor: 'rgb(249,249,249)' }}>
        <View style={styles.container}>
          {this.state.vendors.map((vendor) => (
            <TouchableOpacity
              key={vendor.name}
              style={styles.card}
              onPress={() => this.goToPageTwo(vendor)}
            >
              <Image source={{ uri: vendor.image }} style={{width: '100%', height: 100}} />
              <Text style={styles.name}>{vendor.name}</Text>
              <Text style={styles.description}>{vendor.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 17,
    justifyContent: 'space-between'
  },
  card: {
    width: cardWidth,
    height: 200,
    backgroundColor: 'white',
    marginVertical: 12,
    padding: '2%',
    borderRadius: 5,
    shadowOffset: { width: 2, height: 5 },
    shadowColor: 'rgba(0, 0, 0, .12)',
    shadowOpacity: 0.5,
    elevation: 1
  },
  name: {
    fontSize: 16,
    marginVertical: 10,
    marginHorizontal: 5
  },
  description: {
    fontSize: 14,
    marginHorizontal: 5,
    color: 'rgb(94,94,94)'
  }
})

export default HomeScreen;