


const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');



var password = '123abc!';
var hashedPassword ='$2a$10$T0VAWI2P.LadtsVpbiT/a.E6XGfn86gLscwb4qPUsPTu0EvuyeSt2';
var getHashedPassword = () =>{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                resolve(hash);
            })
        })
    });
}

//the below code is use for get salt and after getting the salt then we calculate the hash for the password

// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(password,salt,(err,hash)=>{
//         hashedPassword = hash;
//         console.log(hash);
//     });
// });

getHashedPassword().then((hash)=>{
    bcrypt.compare('123abc',hashedPassword,(err,res)=>{
        console.log(res);
    });
},(err)=>{
    console.log(err);
});

// var message = 'Hello I am Rajkaran';
// var hash = SHA256(message).toString();
// console.log(`Message ${message}`);
// console.log(`Hash: ${hash}`);




// var data = {
//     id:3,
//     name:'Rajkaran',
//     age:20
// }

// var token = {
//     data:data,
//     hash:SHA256(JSON.stringify(data)+'@#$%').toString()
// }

// //if change happen at client side like....
// // token.data.id = 5;
// // token.data.hash = SHA256(JSON.stringify(data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data)+'@#$%').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed...');
// }
// else{
//     console.log('Data has been changed Don\'t trust');
// }