//REQUIRING PACKAGES AND DB MODELS
const express 		= require("express"); 
const app 			= express(); 
const bodyParser	= require("body-parser");
const mongoose 		= require("mongoose");
const flash			= require("connect-flash");
const passport 		= require("passport");
const LocalStrategy	= require("passport-local");
const methodOverride= require("method-override");
const Lake 			= require("./models/lake");
const Comment 		= require("./models/comment");
const User			= require("./models/user");
const seedDB 		= require("./seeds.js");
const db 		 	= require("./dbconfig.js");
//REQUIRING ROUTES
const commentRoutes = require("./routes/comments.js");
const lakeRoutes 	= require("./routes/lakes.js");
const indexRoutes 	= require("./routes/index.js");

// Database connect 

// external database
var dbKey = db();
mongoose.connect("mongodb+srv://"+dbKey+"/LakeReviewsDev?retryWrites=true&w=majority", {
  	useNewUrlParser: true,
  	useUnifiedTopology: true,
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

// mongoose.connect('mongodb://localhost:27017/lake_reviews', { //add database and connect to mongoose
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(err => console.log(err.message));
// mongoose.set('useFindAndModify', false);

//APP PACKAGE SETTINGS
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));// tells express to serve us the contents of the folder 
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

//PASPORT CONFIG
app.use(require("express-session")({
	secret:"Cloud Nerds",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   	res.locals.currentUser = req.user; //available to every route
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Using Routes
app.use("/",indexRoutes);
app.use("/lakes",lakeRoutes);
app.use("/lakes/:id/comments",commentRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});