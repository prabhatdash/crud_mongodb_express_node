const mongoose=require("mongoose")
const loginUsers=mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require: true
    }

})

const user_account=new mongoose.model("login_details",loginUsers)
module.exports=user_account
