const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");	

//Root route 
router.get("/",(req,res)=>{
	res.render("landing");
});


//show register form
router.get("/register",(req,res)=>{
	res.render("register");
});

//handle register signup
router.post("/register",(req,res)=>{
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password,(err,user)=>{
		if (err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success","Welcome to Lake Reviews "+user.username);
			res.redirect("/lakes");
		});
	});
});

// Show login form
router.get("/login",(req,res)=>{
	res.render("login");
});

//Login Logic
router.post("/login",passport.authenticate("local",
	{
		successRedirect:"/lakes",
		failureRedirect:"/login"
	}), (req,res)=>{
	
});

//logout route
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/lakes");
});

module.exports = router;