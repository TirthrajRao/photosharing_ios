import React from 'react'
import Login from './login';
import SignUp from './signUp';
import Follow from './follow';
import Post from './posts';
import Profile from './profile';
import Addpost from './addPost';
import Explore from './explore';
import SinglePost from './singlePost';
import UserProfile from './visitProfile';
import SignOut from './signOut';
import { Router, Scene } from 'react-native-router-flux';
import {Platform, StyleSheet} from 'react-native';
import Search from './Search';
import Message from './message';
import SharedPost from './sharedPost';
import Tabs from './bottomNavigation';
import {createStackNavigator, createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({
	Login: {
		screen: Login,
		navigationOptions:  {
			header:null

		}
	},
	SignUp:{
		screen: SignUp,
		navigationOptions:  {
		header:null
		}
	},
  SignOut:{
    screen: SignOut,
    navigationOptions:  {
      header:null
    }
  },
});

const Routes = createAppContainer(MainNavigator);
const styles = StyleSheet.create({
  navTitle: {
    color: '#696969', // changing navbar title color
    fontWeight:'normal'
  },
})

export default Routes;