const jwt = require('jsonwebtoken');

var data = {
    id:10
}
var token = jwt.sign(data,'@#$%');
console.log(token);


jwt.verify(token+1,"@#$%",(err,decoded)=>{
    if(err){
        return  console.log(JSON.stringify(err));
    }
    console.log(decoded);

});

//var decoded = jwt.verify(token,"@#$%");

