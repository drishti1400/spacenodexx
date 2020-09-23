var express = require("express");
var app = express();

app.get("/home",function(req,res){
	res.send("hello there! welcome");	
});

app.get("/speak/:name",function(req,res){
	var nam=req.params.name;
	res.send("hello "+nam+" welcome");	
});

app.get("/repeat/hello/:n",function(req,res){
	var num=req.params.n;
	var hello;
	var result="";
	for(var i=0;i<num;i++)	{
				result+=hello;	
	}
	res.send(result);
});

app.listen(8080, function(){
	console.log("server started");
});
