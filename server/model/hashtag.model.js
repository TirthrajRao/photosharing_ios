var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var HashTagSchema = new Schema({  

	hashTag:String,
	count:{type:Number,default:1}
});


module.exports = mongoose.model('hashtag', HashTagSchema);