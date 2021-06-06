const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
   productname:String,
   manufacturer:String,
   mrp:Number

});

module.exports =mongoose.model('product',productSchema, 'productmaster');