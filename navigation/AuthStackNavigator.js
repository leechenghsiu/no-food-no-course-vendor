import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const AuthStack = createStackNavigator(
  {
    // 以後可以新增忘記密碼之類的
    Login: LoginScreen
  },
  {
    headerMode: 'none'
  }
);

// Signup 使用 modal
export default createStackNavigator(
  {
    AuthStack: AuthStack,
    Signup: SignupScreen
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

