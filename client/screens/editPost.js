import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, FlatList, Image, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Modal, TouchableHighlight, Dimensions, Alert, ToastAndroid } from 'react-native';
import Config from './config';
var { width } = Dimensions.get('window');
import { EventRegister } from 'react-native-event-listeners';
import _ from 'lodash';
import axios from 'axios';
let config = new Config();

export default class EditPost extends Component {
	constructor(props) {
		super(props)
		this.state = {
			like: [],
			comment: '',
			post: [],
			isVisible: false,
			popoverAnchor: { x: 340, y: 40, width: 80, height: 60 },
			modalVisible: false,
			useName: '',
			content: '',
			ButtonStateHolder: false,
			posts: []
		}
	};

	componentDidMount() {
		console.log("posttttttt in edit post=============>", this.props.navigation.state.params.post);
		this.setState({ posts: this.props.navigation.state.params.post })
		posts = this.props.navigation.state.params.post;
	}
	editPost(data, postId, Data) {
		console.log('data====================>', data, postId, Data);
		var tagsListArr = data.split(' ');
		console.log('tagsListArr===========>', tagsListArr);
		let hashTag = [];
		_.forEach(tagsListArr, (tag) => {
			if (tag.charAt(0) == '#') {
				hashTag.push(tag);
			}
		})
		var tagsListArr1 = Data.split(' ');
		console.log('tagsListArr===========>', tagsListArr);
		let hashTag1 = [];
		_.forEach(tagsListArr1, (tag) => {
			if (tag.charAt(0) == '#') {
				hashTag1.push(tag);
			}
		})
		this.setState({
			ButtonStateHolder: true
		})
		var apiBaseUrl = config.getBaseUrl() + "post/updatepost/" + postId;
		if (!data) {
			var payload = {
				"content": Data,
				"hashTag": hashTag1,
			}
			axios.put(apiBaseUrl, payload)
				.then(function (response) {
					console.log("response=================>", response.data);
					console.log("edit post successfull");
				}).then(() => { this.props.navigation.navigate('SinglePost', { id: postId }), this.setState({ ButtonStateHolder: false }); })
				.catch(function (err) {
					console.log(err);
					this.setState({ ButtonStateHolder: false });
				})
		} else {
			var payload = {
				"content": data,
				"hashTag": hashTag
			}
			axios.put(apiBaseUrl, payload)
				.then(function (response) {
					console.log("response=================>", response.data);
					console.log("edit post successfull");
				}).then(() => { this.props.navigation.navigate('SinglePost', { id: postId }), this.setState({ ButtonStateHolder: false }); })
				.catch(function (err) {
					console.log(err);
					this.setState({ ButtonStateHolder: false });
				})
		}
	}
	render() {
		console.log("postttttttttt================>", this.state.posts)
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
				{this.state.posts.map((item) =>
					<View style={[styles.card, { elevation: 3 }]}>
						<View style={{ flexDirection: 'column' }}>
							<Text style={styles.userName}>{item.userId.userName}</Text>
							<Text style={{ marginLeft: 20, color: 'black' }}>Caption</Text>
							<TextInput
								value={this.state.content}
								onChangeText={(content) => this.setState({ content: content })}
								placeholder={item.content}
								style={[styles.editInput, { marginLeft: 20 }]}
							/>
							<Image resizeMode='cover' style={styles.img} source={{ uri: config.getMediaUrl() + item.images }} />
						</View>

						<TouchableOpacity style={{ borderWidth: 1, marginTop: 20, borderColor: this.state.ButtonStateHolder ? 'gray' : 'black', padding: 8, width: 100, marginLeft: 15, marginBottom: 15, borderRadius: 5 }}
							disabled={this.state.ButtonStateHolder}
							onPress={() => {
								this.editPost(this.state.content, item._id, item.content);
							}}>
							<Text style={{ textAlign: 'center' }}>Edit Post</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	editInput: {
		width: 300,
		borderBottomWidth: 1,
		borderColor: '#C0C0C0',
		padding: 0,
		marginLeft: 10,
	},
	userName: {
		color: 'black',
		fontSize: 20,
		marginLeft: 20,
		marginTop: 10,
		fontWeight: 'bold'
	},
	img: {
		height: 325,
		width: width * 1,
		marginTop: 10
	},
})