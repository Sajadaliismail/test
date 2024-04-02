const express = require("express");
const router = express.Router();
const collection = require("./model");
const bcrypt = require('bcrypt');
const user = collection
//login
router.post("/login", async (req, res) => {
  try {
    const user = await collection.findOne({ name: req.body.name });
    if (user.name) {
      const isValid = await bcrypt.compare(req.body.password,user.password)
      if (isValid) {
        req.session.user = user.email;
        res.redirect("/route/home");
      } 
      else {
        res.render("login",{error:"Incorrect password"});
      }
    }
  } 
  catch (error) {
    // send an error response to the client.
    res.render("login",{error:"Incorrect username"});
  }
});

//signup
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password,10)
  const data = new user({
    name: req.body.name,
    password:hash,
    email: req.body.email,
    gender: req.body.gender,
    status: req.body.status
  });
  console.log(data);
  //insert data to database
  await data.save([data]);
  req.session.user = data.email;
  console.log(data);
  res.redirect("/route/home");
});

//middleware to check whether data exists in the database
async function checkuser(req, res, next) {
  try {
    const resultname = await collection.findOne(
      { name: req.body.name },
      { name: 1, _id: 0 }
    );
    const resultemail = await collection.findOne(
      { email: req.body.email },
      { email: 1, _id: 0 }
    );

    if (resultname) {
      res.render("signup", { exists: "User name exists" });
    } else if (resultemail) {
      res.render("signup", { exists: "Email already Registered please login" });
    } else {
      // res.render('signup',{exists:'Signup successfull please login again'})
      next();
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

//home page with session
router.get("/home",async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.session.user) {
    const a = await collection.findOne({email:req.session.user});
    res.render("home",{user:a.name,email:a.email});
  } else {
    res.redirect("/");
  }
});



//logout where session is dstroyed
router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render("login");
    }
  });
});

module.exports = a;
