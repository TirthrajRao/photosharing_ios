
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, ToastAndroid, List } from 'react-native';
import Config from './config';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
var { width } = Dimensions.get('screen');
let config = new Config();
let sorted_posts;

export default class Explore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      data: [],
      page: 1,
      loading: true,
      ButtonStateHolder: false,
    }
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getAllPost();
      });
  };
  getAllPost = async () => {
    await fetch(config.getBaseUrl() + "post/get-all-post" + "?offset=" + this.state.page).
      then((Response) => Response.json()).
      then((response) => {
        console.log('all post postss===================>', response);
        this.setState(prevState => ({
          posts: [...prevState.posts, ...response]
        }))
      }, function (err) {
        console.log(err);
      })

  }
  handleEnd = () => {
    console.log("handleend callll==================>", this.state.page);
    console.log("handleend calllling==================>", this.state.page);
    this.setState(prevState => ({ page: prevState.page + 1 }), () => this.getAllPost());
  }
  render() {
    console.log("posttttttttt=============>", this.state.posts);
    console.log("searched post=====================>", this.state.searchedPost);
    if (!this.state.posts.length) {
      return (
        <>
          <View style={{ height: 50, elevation: 3, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, top: 10, left: 20 }}>Explore</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 10 }}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => this.props.navigation.navigate('Search')}>
                <Text style={{ color: 'gray' }}>Search</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Icon name='search' color='black' size={27} style={{ marginTop: 5, opacity: 0.5, marginLeft: 5 }} />
            </View>
          </View>
          <View style={[styles.horizontal, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
            <ActivityIndicator size="large" color="#ef6858" />
          </View>
        </>
      )
    } else {
      return (
        <>
          <View style={{ height: 50, elevation: 3, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, top: 10, left: 20 }}>Explore</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 10 }}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => this.props.navigation.navigate('Search')}>
                <Text style={{ color: 'gray' }}>Search</Text>

              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Icon name='search' color='black' size={27} style={{ marginTop: 5, opacity: 0.5, marginLeft: 5 }} />
            </View>
          </View>
          <View style={{ marginBottom: 100 }}>
            <FlatList
              data={this.state.posts}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.6}
              onEndReached={() => {
                this.handleEnd();
              }}
              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
              renderItem={({ item }) =>
                <Image style={styles.img} source={{ uri: config.getMediaUrl() + item.images }} />
              }
              numColumns={2}
            />
          </View>
        </>
      );
    }
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  footer: {
    flexDirection: 'column', flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: width / 2.11,
    width: width / 2.11,
    margin: 5,
    borderRadius: 3
  },
  MainContainer:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },

  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  input: {
    padding: 6,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 12,
    borderRadius: 5
  },

});
