const mongose = require("mongoose");


const db = "mongodb+srv://asad:asad123123@cluster0.ulf5twe.mongodb.net/?retryWrites=true&w=majority";
mongose.connect(db , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("connection Done!");
}).catch((err)=>{
    console.log(err);
})