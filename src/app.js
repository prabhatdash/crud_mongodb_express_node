const express=require("express")
const app=express()
const hbs=require("hbs")
const body_parser=require("body-parser")
const path=require("path")
const port=3001
const views_path=path.join(__dirname,"../template/views")
const partials_path=path.join(__dirname,"../template/partials")
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:false}))
app.use("/css",express.static(path.join(__dirname,"../template/assets/css")))
app.use("/images",express.static(path.join(__dirname,"../template/assets/images")))
hbs.registerPartials(partials_path)
require("./db/conn")
const register=require("./models/register")
const mongoose = require("mongoose");
const session=require("express-session")
const bcrypt=require("bcryptjs")
const user=require("./models/users")

app.use(
   session(
       {
           secret:"ddsc12",
           resave:false,
           saveUninitialized:true,
           cookie:false
       }
   )
)


app.listen(port,()=>{
    console.log(`My app is running in port: ${port}`)
})


app.set("view engine","hbs")
app.set("views",views_path)
app.get("/sample",(req,res)=>{
    res.send("EXPRESS IS RUNNING !")
})

app.get("/",(req,res)=>{
    res.render("login")
})


app.get("/create_account",(req,res)=>{
    res.render("create_account")
})

app.get("/logout",(req,res)=>{
    req.session.destroy((e)=>{
        const message="Logout Successfull !"
        res.render("login",{message})
    })
})

app.get("/display",async(req,res)=>{
    if(req.session.user){
        const data= await register.find()
        res.render("display",{data})
    }
    else{
        res.render("login")
    }
})


app.post("/insert_account",async(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ username, password: hashedPassword });
        await newUser.save();
        res.render('index', { message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.render('index', { message: 'ERROR CODE: 500' });
    }

})


app.get("/insert",(req,res)=>{
    if(req.session.user){
        res.render("insert")
    }
    else{
        res.render("login")
    }
})


app.post("/save_data",async(req,res)=>{
    const roll=req.body.roll
    const name=req.body.name

    const register_user=new register(
        {
            roll_no:roll,
            name:name
        }
    )
    register_user.save().then(
        (result)=>{
            console.log(result)
            res.send("Data Inserted !")
        }
    ).catch(
        (e)=>{
            console.log(e)
        }
    )
})

app.post("/update",async(req,res)=>{
    const id=req.body.id
    const roll_no=req.body.roll
    const name=req.body.name
    const btn=req.body.btn

    if(btn==="UPDATE"){
        const respond= await register.updateOne({"_id":new mongoose.Types.ObjectId(id)},{$set:{"name":name,"roll_no":roll_no}})
        const data= await register.find()
        res.render("display",{data})
    }
    if(btn==="DELETE"){
        const respond= await register.deleteOne({"_id": new mongoose.Types.ObjectId(id)})
        const data= await register.find()
        res.render("display",{data})
    }
})



app.post("/auth",async(req,res)=>{

    const username=req.body.username
    const password=req.body.password
    const user_data = await user.findOne({ "username": username });

    if (user_data) {
        const passwordMatch = await bcrypt.compare(password, user_data.password);
        if (passwordMatch) {
            req.session.user = user_data.username;
            const data= await register.find()
            res.render("display",{data})
        } else {
            res.status(401).send('Invalid credentials');
        }
    } else {
        res.status(401).send('Invalid credentials');
    }



})

