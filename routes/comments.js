const express = require("express");
const router = express.Router({mergeParams: true});
const Lake = require("../models/lake");
const Comment = require("../models/comment");
const middleware = require("../middleware")//goes right to index.js 
//comments new
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	Lake.findById(req.params.id,(err,lake)=>{
		if(err){
			req.flash("error","Something went wrong :(");
		}else{
			res.render("comments/new",{lake:lake});
		}
	});
});

//Comments create
router.post("/",middleware.isLoggedIn,(req,res)=>{
	Lake.findById(req.params.id,(err,lake)=>{
		if (err){
			req.flash("error","Something went wrong :(");
			res.redirect("/show");
		}else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){
					console.log(err);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					lake.comments.push(comment);
					lake.save();
					res.redirect("/lakes/"+lake._id);
				}
			})
		}
	});
});
//EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
	Lake.findById(req.params.id,(err,foundLake)=>{
		if(err || !foundLake){
			req.flash("error","No lake found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
			if(err){
				req.flash("error","Something went wrong :(");
				res.redirect("back");
			}else{
				res.render("comments/edit",{lake_id:req.params.id, comment:foundComment});
			}
		});
	});
});
//UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	//comment.findbyid and update
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err,updatedComment)=>{
		if(err){
			req.flash("error","Something went wrong :(");
			res.redirect("back");
		}else{
			res.redirect("/lakes/"+req.params.id);
		}
	});
});
//DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	 Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		 if(err){
			req.flash("error","Something went wrong :(");
			res.redirect("back");
		 }else{
			res.redirect("/lakes/"+req.params.id);	
		 }
		 
	 });
});


module.exports = router;