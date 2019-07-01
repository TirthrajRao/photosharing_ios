
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, ScrollView, ToastAndroid, Image, ActivityIndicator, FlatList
} from 'react-native';
import Config from './config';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

let config = new Config();
let sorted_posts;

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post: []
    };
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.componentDidMount();
      });
  }

  componentDidMount = async () => {
    console.log("=======================UserIdddddd===================", this.props.navigation.state.params.userId)
    fetch(config.getBaseUrl() + "post/get-post-by-id/" + this.props.navigation.state.params.userId).
      then((Response) => Response.json()).
      then((response) => {
        console.log('postttttttttttttttttttttttttttt===================>', response);
        sorted_posts = response.post.sort((a, b) => {
          return new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
        }).reverse();
        console.log('sorted post==================================>', sorted_posts);
        this.setState(prevState => ({
          post: response
        }))
      }, function (err) {
        console.log(err);
      })
  }

  profilePic = () => {
    console.log("profile pic===========================>", this.state.post.profilePhoto);
    if (!this.state.post.profilePhoto) {
      return (
        <Image resizeMode='cover' style={styles.profile}
          source={require('../images/profile.png')}
        />
      )
    } else {
      return (
        <Image resizeMode='cover' style={styles.profile} source={{ uri: config.getMediaUrl() + this.state.post.profilePhoto }} />
      )
    }

  }

  render() {
    console.log("post=========================>", this.state.post);
    console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{", this.props.navigation.state.params.userId);
    var postArr = this.state.post.friends;
    if (!postArr) {
      return (
        <>
          <View style={[styles.horizontal, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#ef6858" />
          </View>
        </>
      )
    } else {
      return (
        <>
          <View style={{ backgroundColor: '#ffffff98', paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 5 }}></View>
              <View style={{ flex: 6 }}>
                {this.profilePic()}
              </View>
              <View style={{ flex: 5 }}></View>
            </View>
            <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 22, textAlign: 'center', color: 'black' }}>{this.state.post.userName}</Text>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.post.post.length}</Text>
                <Text>Posts</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.post.followers.length}</Text>
                <Text>Followers</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.post.friends.length}</Text>
                <Text>Following</Text>
              </View>
            </View>
          </View>
          <ScrollView>
            <FlatList
              data={sorted_posts}
              renderItem={({ item }) =>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('SinglePost', { id: item._id })}>
                  <Image style={styles.img} source={{ uri: config.getMediaUrl() + item.images }} />
                </TouchableOpacity>
              }
              numColumns={3}
            />
          </ScrollView>
        </>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e0e0',
    borderRadius: 10,
    padding: 20,
    marginTop: 90,
    height: 'auto',
  },
  profile: {
    borderRadius: 40,
    height: 80,
    width: 80,
    marginTop: 20,
    left: 30,
    borderColor: '#ad177d',
    borderWidth: 3,
    margin: 'auto'

  },
  footer: {
    flexDirection: 'column', flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColor: {
    color: 'black',
    fontWeight: 'bold'
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    elevation: 8
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  img: {
    height: 116,
    width: 116,
    margin: 2,
  },
});
