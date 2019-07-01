const express = require('express');
const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const hashTagModel = require('../model/hashtag.model');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const ObjectId = require('mongodb').ObjectId;



addPost = function (req, res) {
	console.log('req.body=================>', req.body);
	console.log('req.file====================>', req.file);
	const Post = new postModel(req.body);
	Post.save((err, post) => {
		if (err) {
			res.status(500).send(err);
		} else {
			let storage = multer.diskStorage({
				destination: function (req, file, cb) {
					console.log("files--------->>>>>>", file);
					cb(null, './uploads/')
				},
				filename: function (req, file, cb) {
					let ext = '';
					console.log("ext")
					if (file.originalname.split(".").length > 1)
						ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

					cb(null, file.fieldname + '_' + Date.now() + ext)
				}
			})
			let upload = multer({ storage: storage }).single('images');

			upload(req, res, (err) => {
				if (err) return res.send({ err: err });
				console.log("req.file", req.file);

				console.log("============req.body===============>", typeof req.body, req.body);
				let hashTag = JSON.parse(req.body.hashTag);
				console.log('hashtags===================>', hashTag);

				_.forEach(hashTag, function (tag) {
					console.log('tag===============>', tag);
					hashTagModel.findOne({ hashTag: tag })
						.exec((err, foundTag) => {
							if (err) {
								res.status(500).send(err);
								console.log('err------------------>', err);
							} else if (foundTag) {
								console.log('foundTag===============>', foundTag);
								foundTag.count++;
								foundTag.save();

							} else {
								console.log("==================not found======================")
								let data = {
									hashTag: tag,
									count: 1
								}
								let hashnew = new hashTagModel(data);
								hashnew.save();
							}
						})

				})

				req.body.images = req.file.filename;
				postModel.findOneAndUpdate({ _id: post._id }, { $set: req.body }, { upsert: true, new: true }).exec((error, post) => {
					if (error) res.status(415).send(error);
					console.log("post==============================>", post);
					res.status(200).send(post);

				})
			})
		}
	})
}

getAllPost = function (req, res) {
	console.log("req.param", req.query.offset)
	// postModel.find({})

	let _pageNumber = req.query.offset,
		_pageSize = 10;
	postModel.aggregate([
		{ $match: { 'isDelete': false } },
		{
			$project: {
				_id: '$_id',
				images: 1,
				created_date: 1
			}
		},
		{ '$sort': { 'created_date': -1 } },
		{ $skip: ((_pageNumber - 1) * _pageSize) },
		{ $limit: _pageSize },



	])
		// .skip((_pageNumber > 0 ? ((_pageNumber - 1) * _pageSize) : 0))
		// .limit(_pageSize)
		.exec((err, posts) => {
			if (err) {
				res.status(500).send(err);
			} else {
				console.log('all post====================>', posts.length)
				res.status(200).send(posts);
			}
		})
}



getPostByUserId = function (req, res) {
	var curruntUser = req.params.userId;
	console.log('userid=================>', curruntUser);

	userModel.aggregate([
		{$match: { '_id': ObjectId(curruntUser) }},
		{
			$lookup: {
				from: 'posts',
				localField: '_id',
				foreignField: 'userId',
				as: 'post'
			}
		},
		{$unwind: '$post'},
		{$match: {"post.isDelete": false}},
		{
			$group: {
				_id: '$_id',
				name: {$first: '$name'},
				friends: {$first: '$friends'},
				followers: {$first: '$followers'},
				userName: {$first: '$userName'},
				email: {$first: '$email'},
				password: {
					$first: '$password'
				},

				profilePhoto: { $first: '$profilePhoto' },

				post: {
					$push: '$post',
				},

			}
		},





	])


		.exec((err, post) => {
			if (err) {
				res.status(500).send(err);
			} else {
				console.log('post===========================>', post);
				res.status(200).send(post[0]);
			}
		})
}


updatePostById = function (req, res) {
	var postId = req.params.postId;
	console.log('postid====================>', postId);
	console.log("req.body======================>", req.body);
	// var hashTag = JSON.parse(req.body.hashTag);
	console.log('hashtags===================>', req.body.hashTag);
	_.forEach(req.body.hashTag, function (tag) {
		console.log('tag===============>', tag);
		hashTagModel.findOne({ hashTag: tag })
			.exec((err, foundTag) => {
				if (err) {
					res.status(500).send(err);
					console.log('err------------------>', err);
				} else if (foundTag) {
					console.log('foundTag===============>', foundTag);
					foundTag.count++;
					foundTag.save();

				} else {
					console.log("==================not found======================")
					var data = {
						hashTag: tag,
						count: 1
					}
					var hashnew = new hashTagModel(data);
					hashnew.save();
				}
			})

	})
	postModel.findOneAndUpdate({ _id: req.params.postId }, req.body, { upsert: true }, function (err, post) {
		if (err) {
			res.status(500).send(err);
		} else {
			console.log('post======================>', post);

			// if(err){
			// 	res.status(500).send(err);
			// }else{
			console.log("post========================>", post);
			res.status(200).send(post)
		}

	});

}

getPostBYPostId = function (req, res) {
	var postId = req.params.postId;
	console.log("postIid===============>", postId)
	postModel.aggregate([
		{
			$match: { '_id': ObjectId(postId) }
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'userId'
			}
		},
		{
			$unwind: {
				path: '$userId',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$lookup: {
				from: 'comments',
				localField: 'comment',
				foreignField: '_id',
				as: 'comment'
			}
		},
		{
			$unwind: {
				path: '$comment',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'comment.userId',
				foreignField: '_id',
				as: 'comment.userId'
			}
		},
		{
			$unwind: {
				path: '$comment.userId',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$group: {
				_id: '$_id',
				userId: { $first: '$userId' },
				like: { $first: '$like' },
				comment: { $push: '$comment' },
				content: { $first: '$content' },
				created_date: { $first: '$created_date' },
				isLiked: { $first: '$isLiked' },
				images: { $first: '$images' },
			}
		},




	]).exec((err, post) => {
		if (err) {
			res.status(500).send(err);
		} else {
			console.log('post========================>', post);
			res.status(200).send(post);
		}
	})
}



deletePost = function (req, res) {
	console.log("postIddddddd==========================>", req.params.postId)
	postModel.findOneAndUpdate({ _id: req.params.postId }, { $set: { isDelete: true } }, { upsert: true, new: true }, function (err, post) {
		if (err) {
			res.status(500).send(err);
		} else {
			console.log('post============>', post);
			res.status(200).send(post);
		}
	})
}


getMyFriendsPost = function (req, res) {
	var currentUser = req.params.userId;
	console.log("current User", currentUser);
	userModel.aggregate([
		{
			$match: { '_id': ObjectId(currentUser) }
		},

		{
			$lookup: {
				from: 'posts',
				localField: 'friends',
				foreignField: 'userId',
				as: 'post'
			}
		},
		{
			$unwind: {
				path: '$post',
				preserveNullAndEmptyArrays: true
			}
		},
		// {
		// 	$match:{
		// 		"post.isDelete": false
		// 	}
		// },


		{
			$lookup: {
				from: 'users',
				localField: 'post.userId',
				foreignField: '_id',
				as: 'post.userId'
			}
		},
		{
			$unwind: {
				path: '$post.userId',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$unwind: {
				path: '$post.comment',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$lookup: {
				from: 'comments',
				localField: 'post.comment',
				foreignField: '_id',
				as: 'post.comment'
			}
		},
		{
			$unwind: {
				path: '$post.comment',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'post.comment.userId',
				foreignField: '_id',
				as: 'post.comment.userId'
			}
		},
		{
			$unwind: {
				path: '$post.comment.userId',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$group: {
				_id: '$post._id',
				userId: { $first: '$_id' },
				name: { $first: '$name' },
				friends: { $first: '$friends' },
				followers: { $first: '$followers' },
				userName: { $first: '$userName' },
				email: { $first: '$email' },
				profilePhoto: { $first: '$profilePhoto' },
				comment: { $push: '$post.comment' },
				friendsPost: { $first: '$post' },
			}
		},
		{ $sort: { 'friendsPost.created_date': -1 } },
		// {$skip:((_pageNumber - 1) * _pageSize)},
		// {$limit : _pageSize},
		{
			$project: {
				_id: '$userId',
				name: 1,
				friends: 1,
				followers: 1,
				userName: 1,
				profilePhoto: 1,
				email: 1,
				friendsPost: {
					_id: '$friendsPost._id',
					userId: '$friendsPost.userId',
					like: '$friendsPost.like',
					isLiked: '$friendsPost.isLiked',
					comment: '$comment',
					content: '$friendsPost.content',
					created_date: '$friendsPost.created_date',
					images: '$friendsPost.images',
					sharePostCount: '$friendsPost.sharePostCount'
				}
			}
		},

		{
			$group: {
				_id: '$_id',
				name: { $first: '$name' },
				friends: { $first: '$friends' },
				followers: { $first: '$followers' },
				userName: { $first: '$userName' },
				email: { $first: '$email' },
				profilePhoto: { $first: '$profilePhoto' },
				friendsPost: {
					$push: '$friendsPost'
				}
			}
		},



	])

		.exec((err, post) => {
			if (err) {
				console.log('err: ', err);
			} else {
				console.log('friends posts======================>', post);
				res.status(200).send(post[0]);
			}
		})
}



likePost = function (req, res) {
	var postId = req.body.postId;
	console.log('postId=================>', postId);
	var userId = req.body.userId;
	console.log('userId=================>', userId);
	postModel.findOne({ _id: postId }, function (err, foundPost) {
		if (err) {
			res.status(500).send(err);
		}
		var index = foundPost.like.indexOf(userId);
		console.log("index===========================//>", index);
		if (index != -1) {
			console.log("already liked");
			foundPost.like.splice(index, 1);
			foundPost.isLiked = false;
			foundPost.save();
			res.status(200).send(foundPost);

		}

		else {
			console.log('foundUser========================>', foundPost);
			foundPost.like.push(userId);
			foundPost.isLiked = true;
			foundPost.save();
			res.status(200).send(foundPost);
		}
	})
}


disLikePost = function (req, res) {
	var postId = req.body.postId;
	console.log('postId=================>', postId);
	var userId = req.body.userId;
	console.log('userId=================>', userId);
	postModel.findOne({ _id: postId }, function (err, foundPost) {
		if (err) {
			res.status(500).send(err)
		}
		var index = foundPost.like.indexOf(userId);
		if (index == -1) {
			console.log("user not found");
			res.status(401).send("Bad Request")
		} else {
			foundPost.like.splice(index, 1);
			foundPost.save();
			res.status(200).send(foundPost);
		}
	})
}


searchPost = function (req, res) {
	console.log('req,body===================>', req.body);
	var value = req.body.key;
	console.log('search texttttttttttt================>', value);
	postModel.aggregate([
		{
			$match: { $and: [{ 'content': { $regex: value, $options: 'i' } }, { 'isDelete': false }] }
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'userId'
			}
		},
		{
			$unwind: {
				path: '$userId',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$lookup: {
				from: 'comments',
				localField: 'comment',
				foreignField: '_id',
				as: 'comment'
			}
		},
		{
			$unwind: {
				path: '$comment',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'comment.userId',
				foreignField: '_id',
				as: 'comment.userId'
			}
		},
		{
			$unwind: {
				path: '$comment.userId',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$group: {
				_id: '$_id',
				userId: { $first: '$userId' },
				like: { $first: '$like' },
				comment: { $push: '$comment' },
				content: { $first: '$content' },
				created_date: { $first: '$created_date' },
				isLiked: { $first: '$isLiked' },
				images: { $first: '$images' },
			}
		},
	])
		.exec((err, foundPost) => {
			if (err) {
				console.log('err: ', err);
			} else {
				console.log('friends posts======================>', foundPost);
				res.status(200).send(foundPost);
			}
		})
	// }else{
	// User.find({userName:{$regex:value,$options:'i'}},function(err,foundUser){
	// 	if(err){			
	// 		console.log('==============err============',err)
	// 		res.status(500).send(err);
	// 	}else{	
	// 		console.log('res===================>',foundUser)
	// 		res.status(200).send(foundUser)
	// 	}
	// })
	// }
}









module.exports = {
	addPost: addPost,
	getAllPost: getAllPost,
	getPostByUserId: getPostByUserId,
	updatePostById: updatePostById,
	getPostBYPostId: getPostBYPostId,
	deletePost: deletePost,
	getMyFriendsPost: getMyFriendsPost,
	likePost: likePost,
	disLikePost: disLikePost,
	searchPost: searchPost
};