
import React, { Component } from 'react';
import { createStackNavigator, createMaterialTopTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import { Platform, StyleSheet, Text, View, Button, ToastAndroid } from 'react-native';
import Followers from './Followers';
import Following from './Following';


const TabScreen = createMaterialTopTabNavigator(
  {
    Following: { screen: Following },
    Followers: { screen: Followers },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#302f2f',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: '#ffffff',
      },
      labelStyle: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15
      },
      indicatorStyle: {
        borderBottomColor: '#363636',
        borderBottomWidth: 2,
      },
    },
  }
);

const Follow = createStackNavigator({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      header: null
    },
  },

});
//For React Navigation Version 2+
export default Follow;
