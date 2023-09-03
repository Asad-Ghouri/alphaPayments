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
    location:{
        type: String,
        required:true
    },
    credit:{
        type: Number
    },
    phone_no:{
        type: String,
        required:true
    }
})

const Customer = mongose.model('CUSTOMER',userScheam);

module.exports = Customer;