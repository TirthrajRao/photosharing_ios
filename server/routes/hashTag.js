var express = require('express');
var router = express.Router();
var hashTagController = require('./../controller/hashTag.controller')

router.post('/addtag',hashTagController.addTag);
router.get('/gettag',hashTagController.getTag);

module.exports = router;