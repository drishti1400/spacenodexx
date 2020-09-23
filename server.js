var express  = require('express'),
    path     = require('path'),
    request  =require('request'),
    mongoose =require("mongoose"),
    passport =require("passport"),
  bodyParser =require("body-parser"),
	User     =require("./user"),
	Name     =require("./name"),
LocalStrategy=require("passport-local"),
passportLocalMongoose=require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/data", {useNewUrlParser: true, useUnifiedTopology: true});

 
var app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(express.static("views"));
app.set("view engine","ejs");


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routes

app.get('/',function(req,res){
	res.render("index");
});

app.get('/home',isLoggedIn,function(req,res){
	res.render("vindex");
});

app.get('/about',function(req,res){
	res.render("about");
});

app.get('/results',isLoggedIn,function(req,res){
	request("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=9",function(error,response,body){
		if(!error && response.statusCode==200){
			var results = JSON.parse(body);
			res.render("image",{results: results});
		}
	});
});

app.get('/launches',isLoggedIn,function(req,res){
	var query = req.query.search;
	request("https://spacelaunchnow.me/api/3.3.0/launch/?mode=list&limit=15&search="+query,function(error,response,body){
		if(!error && response.statusCode==200){
			var result = JSON.parse(body);
			res.render("la",{result: result});
		}
	});
});

app.get('/upcominglaunches',isLoggedIn,function(req,res){
	request("https://spacelaunchnow.me/api/3.3.0/launch/upcoming/",function(error,response,body){
		if(!error && response.statusCode==200){
			var resu = JSON.parse(body);
			res.render("upresult",{resu: resu});
		}
	});
});
	
app.get('/register',function(req,res){
	res.render("register");
});

app.post("/register", function(req, res){
	req.body.username
	req.body.password
	req.body.fname
	req.body.lname
	var cname = new Name({
		Firstname : req.body.fname,
		Lastname  : req.body.lname,
		Username  : req.body.username
	});
	cname.save();
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/home");
        });
    });
});

app.get('/login',function(req,res){
	res.render("login");
});

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
	
app.listen(8080, function(){
	console.log("server started");
});