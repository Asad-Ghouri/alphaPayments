const mongose = require("mongoose");

const userScheam = new mongose.Schema({
    id:{
        type: String,
        required:true
    },
    name:{
        type: String,
        required:true
    },
    address:{
        type: String,
        required:true
    },
    phone_no:{
        type: String,
        required:true
    },
    phone_no1:{
        type: String,
    }
})

const Shop = mongose.model('SHOP',userScheam);

module.exports = Shop;