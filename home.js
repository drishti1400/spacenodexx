const express   = require('express');
const router    = express.Router();

const app = express();



// Set ejs template engine
app.set('view engine', 'ejs');
app.set()

router.get('/', (req,res)=>{
	res.render("wlc");
});

router.get('/home', (req,res)=>{
	res.render("h");
});

app.use(router);
	
	
app.listen(8080, function(){
	console.log("server started");
});