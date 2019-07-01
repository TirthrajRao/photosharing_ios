var express = require('express');
var router = express.Router();
var messageController = require('./../controller/message.controller');


router.post('/sharepost',messageController.sharedPost);


router.get('/get-shared-post/:curruntUserId',messageController.getShardPost);
router.get('/get-shared-post-by-id/:id',messageController.getPostsById);





module.exports = router;