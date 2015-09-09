
var express = require('express')
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"))
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
var mongoose = require("mongoose");
mongoose.set('debug', true);
var db = mongoose.connection;
mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
 console.log("yay!")
});

var countrySchema = new mongoose.Schema({
	name: String,
	capitol: String,
	population: Number,
	flag: String
})
var Country =  mongoose.model("Country", countrySchema);

//shows all countries 
app.get('/countries', function (req,res){
	Country.find({}, function(err, countries){
			res.render('index', {countries: countries})
	});
});

//form to add a new country
app.get('/countries/new', function (req, res){
	res.render('new')
});

//submits the form for a new country and returns to country list
app.post('/countries', function (req,res){
	Country.create (
		{
			name: req.body.country,
			capitol: req.body.capitol,
			population: req.body.population,
			flag: req.body.flag
		})
	res.redirect('/countries')
});

//gets a single country based on ID
app.get('/countries/:id', function (req,res){
	id = req.params.id
	Country.findById (id, (function (err, country){
		res.render('single', {country: country})
	}))
})

//updates a country 
app.put('/countries/:id', function (req, res){
	id = req.params.id;
	Country.findByIdAndUpdate(id, {
			name: req.body.country,
			capitol: req.body.capitol,
			population: req.body.population
	}, function (err, up){
	});
	res.redirect('/countries')
})


// deletes country
app.delete('/countries/:id', function (req,res){
	id = req.params.id;
	Country.findByIdAndRemove(id, function(err, bye){ })
		res.redirect('/countries')
})


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(4000, function(){
})
