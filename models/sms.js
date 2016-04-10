var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SMS = new Schema({
	mobile: String,
	status: String,
	content: String,
	templateId: String,
	sendId: String,
	date: Date,
	error: String
});

module.exports = mongoose.model('SMS', SMS);