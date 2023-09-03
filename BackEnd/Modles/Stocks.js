
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
    Sname:{
        type: String,
        required:true
    },
    Bname:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    type:{
        type: String,
        required:true
    },
    purchasing:[{
        type: Number,
        required:true
    }],
    price:{
        type: Number,
        required:true
    }, 
    quantity:[{
        type: Number,
        required:true
    }],
    remaining:{
        type: Number,
        required:true
    },
    totalcost:[{
        type: Number,
        required:true
    }],
    date:[{
        type: String,
        required:true
    }]
})

const Stocks = mongose.model('STOCKS',userScheam);

module.exports = Stocks;