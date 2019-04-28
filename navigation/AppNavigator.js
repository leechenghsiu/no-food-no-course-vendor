import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import AuthLoadingScreen from './AuthLoadingScreen';
import MainTabNavigator from './MainTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';

export default createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStackNavigator,
    Main: MainTabNavigator
  },
  {
    initialRouteName: 'AuthLoading'
});