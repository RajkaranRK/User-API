

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    password:{
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
    email:{
        unique:true,
        type:String,
        required:true,
        trim:true,
        minlength:1,
        validate:{
            validator : validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    tokens:[{
        token:{
            type:String,
            require:true
        },
        access:{
            type:String,
            required:true
        }
    }]
});

//use for deciding what to send as response to user
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
}

//use to genrate the token for new user
UserSchema.methods.genrateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'abc123');
    }catch(e){
        // return new Promise((resolve,reject)=>{
        //     reject({error:'Unauthorized person'});
        // });
        return Promise.reject({error:'Unauthorized person'});//this work same as above

    }
    // var obj = {
    //     '_id':decoded._id,
    //     'tokens.token':token,
    //     'tokens.access':'auth'
    // }
    // console.log(JSON.stringify(obj,undefined,2));
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}


UserSchema.statics.findByEmailAndPassword = function(email,password){
    var User = this;
    return User.findOne({email}).then((user)=>{
      if(!user)  {
          return Promise.reject();
      }
      return new Promise((resolve,reject)=>{
          bcrypt.compare(password,user.password,(err,res)=>{
              if(res){
                  resolve({
                      email:user.email,
                      _id:user._id
                  });
              }
              else{
                  reject();
              }
          })
      });
    })    
}


UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        })
    }
    else{
        next();
    }
});


var User = mongoose.model('User',UserSchema);
module.exports = {User};
