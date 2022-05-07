import * as React from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard, Button } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from './screens/Login';
import Signup from './screens/Signup';
import GameBoard from './screens/GameBoard';
//import HomeScreen from './screens/Home';
//import MyProfile from './screens/MyProfile';
import Lobby from './screens/LobbyScreen';

const RootStack = createStackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup },
    //Home: { screen: HomeScreen },
    GameBoard: { screen: GameBoard },
    //Profile: { screen: MyProfile },
    Lobby: { screen: Lobby }
  },
  {
    initialRouteName: 'Login',
  }
);
const AppContainer = createAppContainer(RootStack);
export default AppContainer;

class App extends React.Component {
    constructor(props) {
        StatusBar.setHidden(true);
        //console.log("constructor");
    }
    render() {
        return <AppContainer />;
    }
}