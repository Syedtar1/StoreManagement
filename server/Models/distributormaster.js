const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const distributorSchema = new Schema({
   code:String,
   distributorname:String,
   distributoraddress:String,
   contactperson:String,
   contactnumber:String

});

module.exports =mongoose.model('distributormaster',distributorSchema, 'distributormaster');