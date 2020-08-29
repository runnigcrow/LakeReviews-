const express = require("express");
const router = express.Router({mergeParams:true});
const Lake = require("../models/lake");
const middleware = require("../middleware")//goes right to index.js 

//INDEX(Restful)  
router.get("/",(req,res)=>{
	//get all campgrounds from db and render
	Lake.find({},(err,allLakes)=>{//Alllakes is a parameter Lake is a mongoose model
		if(err){
			req.flash("error","Something went wrong with the lakes");
			console.log(err);
		} else{
			res.render("lakes/index",{lakes:allLakes});
		}
	});
	
});

//CREATE for lakes (Restful) adds to DB
router.post("/",middleware.isLoggedIn,(req,res)=>{// a restful convention thats why its the same name 
	
	//get data from form and add to campgrounds array 
	var name = req.body.name;
	var image = req.body.image;
	var desc= req.body.description;
	var author ={
		id:req.user._id,
		username:req.user.username
	}
	var newLake ={name:name,image:image,description:desc,author:author};
	//creat a new lake and save to database
	Lake.create(newLake,(err,newlyCreated)=>{
		if(err){
			req.flash("error","Something went wrong :( ");
			console.log(err);
		}else{
			req.flash("success", newLake.name+" Added!");
			res.redirect("/lakes");
			
		}		
	});
	//redirect back to campgrounds page
	
});

//NEW for lakes (Restful) shows form 
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("lakes/new");
});

//SHOW for lakes (Restful) about one item
router.get("/:id",(req,res)=>{
	//find campground with provided id
	var id = req.params.id;
	Lake.findById(id).populate("comments").exec((err,foundLake)=>{
		if (err || !foundLake){
			req.flash("error","Lake not found");
			res.redirect("/lakes");
		}else{
			res.render("lakes/show",{lake:foundLake});
		}
	});
});

//Update	/dogs/:id	PUT (for node needs method overide)	Update particular dog, then redirect somewhere	Dog.findByIdAndUpdate()
//EDIT lAKE ROUTE
router.get("/:id/edit",middleware.checkLakeOwnership,(req,res)=>{
	Lake.findById(req.params.id,(err,foundLake)=>{
		res.render("lakes/edit",{lake:foundLake});
	});
});
//UPDATE LAKE ROUTE 
router.put("/:id",middleware.checkLakeOwnership,(req,res)=>{
	var data=
	Lake.findByIdAndUpdate(req.params.id,req.body.lake,(err,updatedLake)=>{
		if(err){
			req.flash("error","Something went wrong :(");
			res.redirect("/lake");
		}else{
			res.redirect("/lakes/"+req.params.id);
		}
	})
})

//DELETE LAKE ROUTE
router.delete("/:id",middleware.checkLakeOwnership,async(req, res)=>{
  	try {
   		let foundLake = await Lake.findById(req.params.id);
		removed=foundLake.name;
    	await foundLake.remove();
		req.flash("success",removed+" has been Removed");
    	res.redirect("/lakes");
  	} catch (error) {
    	req.flash("error",error.message);
    	res.redirect("/lakes");
 	}
});


module.exports = router;