const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const saleOrderSchema = new Schema({
    customername:String,
    contactnumber:String,
    email:String,
    productname:String,
    manufacturer:String,
    discount:Number,
    price:Number
});

module.exports =mongoose.model('saleOrder',saleOrderSchema, 'saleorder');