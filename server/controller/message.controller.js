const express = require('express');
const messageModel = require('../model/message.model');
const postModel = require('../model/post.model');
const ObjectId = require('mongodb').ObjectId;



sharedPost = function (req, res) {
	console.log('===================================');
	const Post = new messageModel(req.body);
	const postId = req.body.postId;
	messageModel.find({ $and: [{ 'desId': req.body.desId }, { 'srcId': req.body.srcId }] }, function (err, foundUser) {
		if (err) {
			console.log('err=================>', err)
			res.status(500).send({message: 'Internal server error'})
		} else if (foundUser.length > 0) {
			console.log("founduser=========================>", foundUser[0]);
			console.log("=============founduser post=================>", foundUser[0].postId);
			foundUser[0].postId.push(postId);
			foundUser[0].save();
			postModel.findOne({ _id: req.body.postId }, function (err, foundPost) {
				if (err) {
					console.log('err=================>', err)
					res.status(500).send({message: 'Internal server error'})
				} else {
					console.log("=============founduser post=================>", foundPost);
					console.log("=============founduser post sharecount=================>", foundPost.sharePostCount);
					foundPost.sharePostCount++;
					foundPost.save()

				}
			})
			res.status(200).send(foundUser[0]);
		} else {
			Post.save((err, post) => {
				if (err) {
					console.log('err=================>', err)
					res.status(500).send({message: 'Internal server error'})
				} else {
					console.log("posttt=============================>", post);
					postModel.findOne({ _id: req.body.postId }, function (err, foundPost) {
						if (err) {
							console.log('err=================>', err)
							res.status(500).send({message: 'Internal server error'})
						} else {
							console.log("=============founduser post=================>", foundPost);
							console.log("=============founduser post sharecount=================>", foundPost.sharePostCount);
							foundPost.sharePostCount++;
							foundPost.save()

						}
					})
					res.status(200).send(post);
				}
			})

		}

	})


}


getShardPost = function (req, res) {
	const curruntUserId = req.params.curruntUserId;
	messageModel.aggregate([
		{
			$match: { 'desId': ObjectId(curruntUserId) }
		},
		{
			$lookup: {
				from: 'users',
				localField: 'srcId',
				foreignField: '_id',
				as: 'srcId'
			}
		},
		{
			$unwind: {
				path: '$srcId',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$project: {
				_id: 1,
				postId: 1,
				desId: 1,
				srcId: {
					_id: '$srcId._id',
					userName: '$srcId.userName',
					profilePhoto: '$srcId.profilePhoto'
				}

			}
		}
	])
		// messageModel.find({'desId':curruntUserId})
		.exec((err, users) => {
			if (err) {
				console.log("========================>", err);
				res.status(500).send({message: 'Internal server error'});
			} else {
				console.log("response===========================>", users);
				res.status(200).send(users);
			}
		})
}

getPostsById = function (req, res) {
	console.log("===================", req.params.id)
	messageModel.aggregate([
		{
			$match: { '_id': ObjectId(req.params.id) }
		},
		{
			$lookup: {
				from: 'posts',
				localField: 'postId',
				foreignField: '_id',
				as: 'postId'
			}
		},
		{
			$unwind: {
				path: '$postId',
				preserveNullAndEmptyArrays: true,
			}
		},

		{
			$lookup: {
				from: 'users',
				localField: 'postId.userId',
				foreignField: '_id',
				as: 'postId.userId'
			}
		},
		{
			$unwind: {
				path: '$postId.userId',
				preserveNullAndEmptyArrays: true,
			}
		},
		{
			$group: {
				_id: '$_id',
				srcId: { $first: '$srcId' },
				desId: { $first: '$desId' },
				postId: { $push: '$postId' },
				// PostId: { $reverseArray: "$postId" }
			}
		},


	])
		.exec((err, posts) => {
			if (err) {
				console.log("========================>", err);
				res.status(500).send({message: 'Internal server error'});
			} else {
				console.log("response===========================>", posts[0]);
				res.status(200).send(posts[0]);
			}
		})
}


module.exports = {
	sharedPost:sharedPost,
	getShardPost:getShardPost,
	getPostsById:getPostsById
};