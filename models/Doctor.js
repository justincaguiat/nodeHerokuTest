var mongoose = require('mongoose')

var doctorSchema = new mongoose.Schema({
	fullname : String,
    password: String
})

module.exports = mongoose.model('Doctor', doctorSchema)