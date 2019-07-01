const express = require('express');
const commentModel = require('../model/comment.model');
const postModel = require('../model/post.model');
const userModel = require('../model/user.model');
const ObjectId = require('mongodb').ObjectId;

addComment = function (req, res) {
	console.log("req.body============>", req.body);
	const { comment, postId, userId } = req.body;
	const Comment = new commentModel(req.body);
	Comment.save((err, comments) => {
		if (err) {
			res.status(500).send({message: 'Internal server error'})
		} else {
			postModel.findOneAndUpdate({ _id: postId }, {$push: {comment: comments._id}})
				.exec((err, post) => {
					if (err) {
						res.status(500).send(err)
					} else {
						console.log('post============================>', post);
						console.log('comment=============================>', comments)
						// post.comment.push(comments._id);
						// post.save();
						res.status(200).send(comments);
					}
				})
		}
	})
}

module.exports = {
	addComment: addComment,
};