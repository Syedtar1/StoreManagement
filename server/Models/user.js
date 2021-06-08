const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    usertype:String,
    createddate:Date,
    isactive:Boolean
});

module.exports =mongoose.model('user',userSchema, 'users');