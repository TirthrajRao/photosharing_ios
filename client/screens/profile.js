
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, FlatList, Image, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator, ToastAndroid, Dimensions
} from 'react-native';
import Config from './config';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { EventRegister } from 'react-native-event-listeners';
import Routes from './Routes';
let { width } = Dimensions.get('screen');
let config = new Config();
let sorted_posts;

export default class Profile extends Component {
  constructor(props) {
    super(props)
    global.curruntUserId = ""
    this.state = {
      curruntUserData: [],
      userPost: [],
      isVisible: false,
      userName: '',
      file: "",
      imageName: "",
      ButtonStateHolder: false,
    };
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.componentDidMount();
      });
  }

  componentDidMount = async () => {
    let userId;
    try {
      const curruntUser = await AsyncStorage.getItem('curruntUser');
      if (curruntUser) {
        userId = JSON.parse(curruntUser);
        global.curruntUserId = userId.data._id
        console.log("value===+++++++++++++++++++++===========================>", userId.data._id);
      }
    } catch (error) {
      console.log("err=>", err)
    }
    fetch(config.getBaseUrl() + "user/get-single-user/" + userId.data._id).
      then((Response) => Response.json()).
      then((response) => {
        console.log('currunt user===================>', response);
        console.log('currunt user post===================>', response.post);
        this.setState({
          curruntUserData: [response]
        })
      }, function (err) {
        console.log(err);
      })


    fetch(config.getBaseUrl() + "post/get-post-by-id/" + userId.data._id).
      then((Response) => Response.json()).
      then((response) => {
        console.log('currunt user postss===================>', response);
        console.log('currunt user postsssssssssssssssssssss===================>', response.post);
        sorted_posts = response.post.sort((a, b) => {
          return new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
        }).reverse();
        console.log('sorted post==================================>', sorted_posts);
        this.setState({
          userPost: response
        })
      }, function (err) {
        console.log(err);
      })
  }


  componentWillMount() {
    this.listener = EventRegister.addEventListener('resp', (resp) => {
      console.log("response======================", resp);
      this.setState(prevState => ({
        curruntUserData: [resp]
      }))
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }


  logOut = async () => {
    console.log("logout==============");
    await AsyncStorage.setItem('curruntUser', '');
    const curruntUser = await AsyncStorage.getItem('curruntUser');
    console.log(']]]]]]]]]]]]]]]]]]', curruntUser);
    this.props.navigation.navigate('SignOut');
  }

  openModal() {
    this.setState({ isVisible: true });
  }

  editProfile = async (data, Data, image) => {
    console.log('data===============================>', data, Data, image);
    this.setState({
      ButtonStateHolder: true
    })
    const cleanFilePath = this.state.file.replace('file://', '');
    if (!data) {
      RNFetchBlob.fetch('PUT', config.getBaseUrl() + 'user/update-user/' + global.curruntUserId + '/' + Data, {
        'Content-Type': 'multipart/form-data',
      },
        [
          {
            name: 'userName',
            data: Data
          },

          {
            name: 'profilePhoto',
            filename: this.state.imageName,
            data: RNFetchBlob.wrap(cleanFilePath)
          },

        ]).then((res) => {

          console.log('response====================>', res.data);
          if (res.data == 'try other username.....') {
            console.log("]]]]]]]]]]]]]]]]]]]]]]]");
            ToastAndroid.show('Try other username.....', ToastAndroid.SHORT);
          }
          console.log("=================response============>", JSON.parse(res.data));
          EventRegister.emit('resp', JSON.parse(res.data));
          this.setState({
            ButtonStateHolder: false
          })
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            ButtonStateHolder: false
          })
        })
    }else if(!image){
      if(!data){
        RNFetchBlob.fetch('PUT', config.getBaseUrl() + 'user/update-user/' + global.curruntUserId + '/' + Data, {
          'Content-Type': 'multipart/form-data',
        },
          [
            {
              name: 'userName',
              data: Data
            },
          ]).then((res) => {
  
            console.log('response====================>', res.data);
            if (res.data == 'try other username.....') {
              console.log("]]]]]]]]]]]]]]]]]]]]]]]");
              ToastAndroid.show('Try other username.....', ToastAndroid.SHORT);
            }
            console.log("=================response============>", JSON.parse(res.data));
            EventRegister.emit('resp', JSON.parse(res.data));
            this.setState({
              ButtonStateHolder: false
            })
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              ButtonStateHolder: false
            })
          })
      } else{
        RNFetchBlob.fetch('PUT', config.getBaseUrl() + 'user/update-user/' + global.curruntUserId + '/' + data, {
          'Content-Type': 'multipart/form-data',
        },
          [
            {
              name: 'userName',
              data: data
            },
          ]).then((res) => {
            console.log('response====================>', res.data);
            if (res.data == 'Try other username.....') {
              console.log("]]]]]]]]]]]]]]]]]]]]]]]");
              ToastAndroid.show('try other username.....', ToastAndroid.SHORT);
            }
            console.log("=================response============>", JSON.parse(res.data));
            EventRegister.emit('resp', JSON.parse(res.data));
            this.setState({
              ButtonStateHolder: false
            })
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              ButtonStateHolder: false
            })
          })
      }
    }else {
      RNFetchBlob.fetch('PUT', config.getBaseUrl() + 'user/update-user/' + global.curruntUserId + '/' + data, {
        'Content-Type': 'multipart/form-data',
      },
        [
          {
            name: 'userName',
            data: data
          },

          {
            name: 'profilePhoto',
            filename: this.state.imageName,
            data: RNFetchBlob.wrap(cleanFilePath)
          },

        ]).then((res) => {
          console.log('response====================>', res.data);
          if (res.data == 'Try other username.....') {
            console.log("]]]]]]]]]]]]]]]]]]]]]]]");
            ToastAndroid.show('try other username.....', ToastAndroid.SHORT);
          }
          console.log("=================response============>", JSON.parse(res.data));
          EventRegister.emit('resp', JSON.parse(res.data));
          this.setState({
            ButtonStateHolder: false
          })
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            ButtonStateHolder: false
          })
        })
    }
    this.setState({
      ButtonStateHolder: true,
      isVisible: false
    })
    this.setState({ isVisible: false });
  }
  pickImage = () => {
    console.log("function call=========>");
    const options = {
      allowsEditing: true,
      base64: false
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        console.log("this images===========", response);
        const source = { uri: response.uri }
        console.log("source=============================>", source);
        this.setState({ file: response.uri, imageName: response.fileName });
      }
    })
  };

  profilePic = () => {
    console.log("profile pic===========================>", this.state.curruntUserData.profilePhoto);
    if (!this.state.curruntUserData[0].profilePhoto) {
      return (
        <Image resizeMode='cover' style={styles.profile}
          source={require('../images/profile.png')}
        />
      )
    } else {
      return (
        <Image resizeMode='cover' style={styles.profile} source={{ uri: config.getMediaUrl() + this.state.curruntUserData[0].profilePhoto }} />
      )
    }
  }
  userNameHandle(value) {
    this.setState({
      userName: value.replace(/\s/g, '_')
    })
    console.log("===============userName============", this.state.userName);
  }
  render() {
    console.log("curruntUserData+++++++====================>", this.state.curruntUserData);
    console.log("posttttttttttttttttttttttttt====================>", this.state.userPost);

    let curruntUserArray = this.state.curruntUserData.friends;
    let curruntUserPost = this.state.userPost.friends;
    console.log('curruntUserPost====>', curruntUserPost)
    if (this.state.userPost.length==0 && this.state.curruntUserData.length) {
      return (
        <>
          <View style={{ height: 50, elevation: 3, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, top: 10, left: 20 }}>Profile</Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 8, top: 10, }}
              onPress={this.logOut}>
              <Text style={{ fontSize: 15, color: 'black', borderWidth: 1.5, borderRadius: 10, paddingRight: 15, paddingLeft: 15, paddingTop: 5, paddingBottom: 5, borderColor: '#d6d7da' }}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View>
            <ScrollView>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.isVisible}
                onRequestClose={() => {
                  this.setState({ isVisible: false })
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View>

                    <View style={styles.container1}>
                      <Text style={styles.titleText}>Edit Profile</Text>
                      <View style={{ marginTop: 20 }}>
                        <TextInput
                          value={this.state.userName}
                          onChangeText={(userName) => this.userNameHandle(userName)}
                          placeholder={this.state.curruntUserData[0].userName}
                          style={styles.input}
                        />
                        <Text style={{ marginLeft: 12 }}>Upload Profile</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 6 }}>
                            <Icon name="photo-library"
                              size={70}
                              onPress={this.pickImage}
                              style={{ textAlign: 'right', marginTop: 40 }}
                            />
                          </View>
                          <View style={{ flex: 4 }}>
                            <Image source={{ uri: this.state.file }} style={styles.preview} />
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: this.state.ButtonStateHolder ? '#607D8B' : '#0099e7' }]}
                        disabled={this.state.ButtonStateHolder}
                        onPress={() => this.editProfile(this.state.userName, this.state.curruntUserData[0].userName, this.state.imageName)}
                      >
                        <Text style={{ textAlign: 'center', color: 'white' }}>Edit Profile</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </ScrollView>
          </View>
          <View style={{ backgroundColor: '#ffffff98' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 5 }}></View>
              <View style={{ flex: 6 }}>
                {this.profilePic()}
              </View>
              <View style={{ flex: 5 }}></View>
            </View>
            <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 22, textAlign: 'center', color: 'black' }}>{this.state.curruntUserData[0].userName}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={styles.footer}>
                <Text style={styles.textColor}>0</Text>
                <Text>Posts</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.curruntUserData[0].followers.length}</Text>
                <Text>Followers</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.curruntUserData[0].friends.length}</Text>
                <Text>Following</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { this.openModal() }}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>No Post</Text>
          </View>
        </>
      )
    }
    else if (curruntUserPost) {
      return (
        <>
          <View>
            <ScrollView>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.isVisible}
                onRequestClose={() => {
                  this.setState({ isVisible: false })
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View>
                    <View style={styles.container1}>
                      <Text style={styles.titleText}>Edit Profile</Text>
                      <View style={{ marginTop: 20 }}>
                        <TextInput
                          value={this.state.userName}
                          onChangeText={(userName) => this.userNameHandle(userName)}
                          placeholder={this.state.userPost.userName}
                          style={styles.input}
                        />
                        <Text style={{ marginLeft: 10 }}>Upload Profile</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 6 }}>
                            <Icon name="photo-library"
                              size={70}
                              onPress={this.pickImage}
                              style={{ textAlign: 'right', marginTop: 40 }}
                            />
                          </View>
                          <View style={{ flex: 4 }}>
                            <Image source={{ uri: this.state.file }} style={styles.preview} />
                          </View>
                        </View>


                      </View>

                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: this.state.ButtonStateHolder ? '#607D8B' : '#0099e7' }]}
                        disabled={this.state.ButtonStateHolder}
                        onPress={() => this.editProfile(this.state.userName, this.state.curruntUserData[0].userName, this.state.imageName)}

                      >
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 15 }}>Edit Profile</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </ScrollView>
          </View>
          <View style={{ height: 50, elevation: 3, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, top: 10, left: 20 }}>Profile</Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 8, top: 10, }}
              onPress={this.logOut}>
              <Text style={{ fontSize: 15, color: 'black', borderWidth: 1.5, borderRadius: 10, paddingRight: 15, paddingLeft: 15, paddingTop: 5, paddingBottom: 5, borderColor: '#d6d7da' }}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View>
          </View>
          <View style={{ backgroundColor: '#ffffff98' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 5 }}></View>
              <View style={{ flex: 6 }}>
                {this.profilePic()}
              </View>
              <View style={{ flex: 5 }}></View>
            </View>
            <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 22, textAlign: 'center', color: 'black' }}>{this.state.curruntUserData[0].userName}</Text>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>

              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.userPost.post.length}</Text>
                <Text>Posts</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.userPost.followers.length}</Text>
                <Text>Followers</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.textColor}>{this.state.userPost.friends.length}</Text>
                <Text>Following</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { this.openModal() }}
            >
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 15 }}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <ScrollView>
              <View style={{ flexDirection: 'row', margin: 5 }}>
                <FlatList
                  data={sorted_posts}
                  renderItem={({ item }) =>
                    <TouchableOpacity style={styles.GridViewContainer} onPress={() => this.props.navigation.navigate('SinglePost', { id: item._id })}>
                      <Image style={styles.img} source={{ uri: config.getMediaUrl() + item.images }} />
                    </TouchableOpacity>
                  }
                  numColumns={3}
                />
              </View>
            </ScrollView>
          </View>
        </>
      );
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItem: 'center', flex: 1 }}>
          <View style={styles.horizontal}>
            <ActivityIndicator size="large" color="#ef6858" />
          </View>
        </View>
      )
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
    height: width / 3.2,
    width: width / 3.2,
    margin: 2
  },
  MainContainer:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    elevation: 10
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  button: {
    margin: 20,
    height: 38,
    padding: 10,
    width: 'auto',
    backgroundColor: '#0099e7',
    borderRadius: 5,
  },
  textColor: {
    color: 'black',
    fontWeight: 'bold'
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  input: {
    width: 260,
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#C0C0C0',
    marginBottom: 10,
    marginLeft: 15,
  },
  button1: {
    marginLeft: 10,
    marginTop: 20,
    height: 33,
    padding: 0,
    width: 250,
    backgroundColor: '#0099e7',
    borderRadius: 3,

  },
  container1: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e0e0',
    borderRadius: 10,
    width: 310,
    padding: 10,
    height: 'auto'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  preview: {
    height: 120,
    width: 120,
    borderRadius: 3,
    marginTop: 15
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
  }
});
