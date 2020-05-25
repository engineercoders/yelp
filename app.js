var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose")


mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req,res){
	res.render("landing");
});

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// INDEX
app.get("/campgrounds", function(req,res){
	//Get all campgrounds from db then render
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err)
		} else {
			res.render("index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE
app.post("/campgrounds" , function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc}
	// Create a new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err){
			console.log(err)
		} else {
			res.redirect("/campgrounds");
		}
	})
});

// NEW FORM
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

//SHOW ONE
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err) {
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(3000, function(){
	console.log("Started Server")
});