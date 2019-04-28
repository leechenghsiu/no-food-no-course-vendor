import { AsyncStorage } from 'react-native';

const deviceStorage = {
  async saveToken(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async loadToken() {
    try {
      await AsyncStorage.getItem('id_token');
      await AsyncStorage.getItem('_id');
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async deleteToken() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }
};

export default deviceStorage;