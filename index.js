const express = require('express')
const app = express()
const path = require('path')
const dotenv = require("dotenv");
const hbs = require('hbs')
const connectDB = require('./mongodb');
const router = require('./router')
const { v4: uuidv4 } = require("uuid");
const nocache = require("nocache");
const session = require("express-session");
app.use(express.json()) 
app.set("view engine","hbs")
app.use(express.urlencoded({extended:false}))


app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);
dotenv.config({ path: "config.env" });
connectDB();
app.use("/route", router);

app.get('/user',(req,res)=>{
  res.render("login")
})

const PORT = process.env.PORT||8080



// async function token(req,res){
//    console.log(await collection.findOne({name:req.body.name},{name:1, _id:0}));


// }


app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)})