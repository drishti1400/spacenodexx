var mongoose = require("mongoose");

var nameSchema = new mongoose.Schema({
    	Firstname : String,
		Lastname  : String,
		Username  : String
}); 
	

module.exports = mongoose.model("Name", nameSchema);