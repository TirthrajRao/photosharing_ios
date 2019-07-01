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
import Search from './Search';
import Message from './message';
import { Router, Scene } from 'react-native-router-flux';
import { Platform, StyleSheet } from 'react-native';
import SharedPost from './sharedPost';
import Tabs from './bottomNavigation';
import Following from './Following';
import Followers from './Followers';
import EditPost from './editPost';

import { createStackNavigator, createAppContainer } from 'react-navigation';
const MainNavigator = createStackNavigator({
  Tabs: {
    screen: Tabs,
    navigationOptions: {
      header: null
    }
  },
  Follow: {
    screen: Follow,
    navigationOptions: {
      title: 'Follow',
      headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      header: null
    }
  },
  SinglePost: {
    screen: SinglePost,
    navigationOptions: {
      title: 'SinglePost',
      headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
    }
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      title: 'UserProfile',
      headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
    }
  },
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Search',
      headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
    }
  },
  Message: {
    screen: Message,
    navigationOptions: {
      title: 'Message',
      headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
    }
  },
  SharedPost: {
    screen: SharedPost,
    navigationOptions: {
      title: 'SharedPost',
      headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
    }
  },
  EditPost: {
    screen: EditPost,
    navigationOptions: {
      title: 'EditPost',
      headerTitleStyle: { color: '#696969', fontWeight: 'normal' }
    }
  },
  SignOut: {
    screen: SignOut,
    navigationOptions: {
      header: null
    }
  },
});
const Routes1 = createAppContainer(MainNavigator);

const styles = StyleSheet.create({
  navTitle: {
    color: '#696969', // changing navbar title color
    fontWeight: 'normal'
  },
})

export default Routes1;