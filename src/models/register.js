const mongoose=require("mongoose")
const userData=mongoose.Schema({
    roll_no:{
        type:String,
        require:true,
    },
    name:{
        type:String,
        require: true
    }

})

const Register=new mongoose.model("btech_a",userData)
module.exports=Register
