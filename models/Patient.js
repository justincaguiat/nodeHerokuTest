var mongoose = require('mongoose');
var Doctor = require('./Doctor')

var patientSchema = new mongoose.Schema({
	ID : Number,
	"firstname": String,
	"lastname": String,
    email: String,
	visits:{
		complaint: String,
		billingAmount: Number
	},
	age: Number,
	familyDoctor: String,
	createdAt: Date,
	lastModified: Date
})

module.exports = mongoose.model('Patient', patientSchema)
