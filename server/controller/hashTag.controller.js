const express = require('express');
const hashTagModel = require('../model/hashtag.model');



addTag = function (req, res) {
	// const hashTag = req.body.hashTag;
	const hashTag = new hashTagModel(req.body);
	hashTagModel.findOne({ hashTag: req.body.hashTag })
		.exec((err, foundTag) => {
			if (err) {
				res.status(500).send({message: 'Internal server error'});
				console.log('err------------------>', err);
			} else if (foundTag) {
				console.log('foundTag===============>', foundTag);
				foundTag.count++;
				foundTag.save();
				res.status(200).send(foundTag);

			} else {
				hashTag.save((err, tag) => {
					if (err) {
						res.status(500).send({message: 'Internal server error'});
						console.log('err------------------>', err);
					} else {
						console.log('hastag=================>', tag);
						res.status(200).send(tag);
					}
				})

			}
		})
}

getTag = function (req, res) {
	hashTagModel.find({}, function (err, tag) {
		if (err) {
			res.status(500).send({message: 'Internal server error'});
			console.log('err------------------>', err);
		} else {
			console.log('all tag====================>', tag);
			res.status(200).send(tag);
		}

	})
}

module.exports = {
	addTag: addTag,
	getTag: getTag
}