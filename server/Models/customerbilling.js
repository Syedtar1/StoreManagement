const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const customerBillingDetailsSchema = new Schema({
   customername:String,
   contactnumber:String,
   email:String,
   lastbillingdate:Date,
   lastbillamount:Number
});

module.exports =mongoose.model('customerBillingDetails',customerBillingDetailsSchema, 'customerBillingDetails');