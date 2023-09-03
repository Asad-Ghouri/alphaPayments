const mongose = require("mongoose");

const userScheam = new mongose.Schema({
    id:{
        type: String,
        required:true
    },
    Cname:{
        type: String,
        required:true
    },
    Sname:{
        type: String,
        required:true
    },
    purchasing:{
        type: Number,
        required:true
    },
    profit:{
        type: Number,
        required:true
    },
    price:{
        type: Number
    },
    loan:{
        type: Number
    },
    date:{
        type: String,
        required:true
    }
})

const Sales = mongose.model('SALES',userScheam);

module.exports = Sales;