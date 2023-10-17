const express= require('express')
const app=express()
const dotenv=require('dotenv')
const cors=require('cors')
const mongoose=require('mongoose')


dotenv.config()
app.use(cors())
app.use(express.json())

console.log(process.env.MONGODB_URL)
mongoose.set("strictQuery",false)
mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("database connected")).catch((err)=>console.log(err))
// app.get('/',(req,res)=>{
//     res.send("server is working")
// })
//schema
const userSchema = new mongoose.Schema({
    Fname:{
        type:String,
        require:true
    },
    dob:{
        type:Date,
        default:Date.now
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true

    }
})

const userModel=mongoose.model('user',userSchema)

app.post('/signup',(req,res)=>{
    console.log(req.body)
    const {email}=req.body

    userModel.findOne({email:email}).then((result)=>{
        console.log(result)
        if(result){
            res.send({message:"Email id is already taken",alert:false})
        }
        else{
            const data=userModel(req.body)
            data.save()
            res.send({message:"Register Success",alert: true})
        }
    })
    .catch((err)=>console.log(err));
})

app.post('/login',(req,res)=>{
    const {email,password}=req.body
    userModel.findOne({email:email, password:password}).then((result)=>{
        if(result){
            res.send({message:"Login succesfull", alert:true})
        }
        else{
            res.send({message:"invalid cemail and password", alert:false})
        }
    })
    .catch((err)=>console.log(err))
   
})



const PORT=process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`Welcome to node server ${process.env.PORT}`)
})