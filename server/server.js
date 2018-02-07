

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const mongoose = require('./db/mongose');
const User = require('./models/user').User;

var app = express();
app.use(bodyParser.json());
app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);
    user.save().then(()=>{
        return user.genrateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

var authenticate = (req,res,next)=>{
    var token = req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject({error:'Unable to find the user'});
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send(e);
    });
}

app.get('/user/me',(req,res)=>{
    res.send(req.user);
});


app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    User.findByEmailAndPassword(body.email,body.password).then((user)=>{
        console.log(user);
        res.send(user);
    }).catch((e)=>{
        console.log(e);
        res.status(401).send({error:e});
    });
})
app.listen(3000,()=>{
    console.log('App is listening at port 3000');
    
});

