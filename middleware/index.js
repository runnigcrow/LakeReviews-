const Lake = require("../models/lake");
const Comment = require("../models/comment");

var middlewareObj={};
//adds functions after declaration
middlewareObj.checkLakeOwnership = function (req,res,next){
	if(req.isAuthenticated()){
		Lake.findById(req.params.id,(err,foundLake)=>{
			if(err || !foundLake){
				req.flash("error","Lake not found.");
				res.redirect("back"); 
			}else{
				if(foundLake.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You dont have permisson to do that.");
					res.redirect("back")
				}
			}
		});
	}else{
		req.flash("error","You must be logged in to do that.");
		res.redirect("back");
	}
};
	

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
			if(err || !foundComment){
				req.flash("error","Comment not found");
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You dont have permisson to do that.");
					res.redirect("back")
				}
			}
		});
	}else{
		req.flash("error","You must be logged in to do that.");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You must be logged in to do that.");
	res.redirect("/login");
};
	

module.exports = middlewareObj;