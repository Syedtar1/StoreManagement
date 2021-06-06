const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const inventrySchema = new Schema({
    product:String,
    manufacturer:String, 
    distributorname:String,
    unitreceived:Number,
    distributorPrice:Number,
    deliveredon:Date
});

module.exports =mongoose.model('distributorinventory',inventrySchema, 'distributorinventory');