var express = require('express')
var mongoose = require('mongoose')
var config = require('./config.js')
var bodyParser = require('body-parser')
var Doctor = require('./models/Doctor')
var Patient = require('./models/Patient')
var passport = require('passport');
require('./scripts/passport')(passport);

var app = express()
mongoose.connect('mongodb://justin:justin@ds045107.mongolab.com:45107/healthapp')

//mongoose.connect('mongodb://localhost:27017/test')


app.use(express.static(__dirname + '/scripts/'))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/css'))
app.use(express.static(__dirname + '/views/partials/'))
app.use(express.static(__dirname + '/models/'))
app.use(bodyParser.json())


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function () {
    console.log("connection made to database");
});

//******************PASSPORT**************
app.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { 
      title: 'Health App',
      user : req.user
  });
});

/* GET profile page. */
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        title: 'Profile',
        user : req.user
    });
});

// function to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // if not logged go to default route
    res.redirect('/login');
}

/* GET logout route. */
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET login page. */
app.get('/login', function(req, res) {
    res.render('login', { 
        title: 'Login',
        message: req.flash('loginMessage') });
});

/* POST login data. */
app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));

/* GET signup page. */
app.get('/register', function(req, res) {
    res.render('register', { 
        title: 'Register',
        message: req.flash('signupMessage') });
});

/* POST signup data. */
app.post('/register', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect : '/profile',
    failureRedirect : '/register',
    failureFlash : true
}));


//******************PASSPORT**************


app.get('/', function (req, res) {
    res.sendFile(__dirname + 'views/index.html')
})

app.post('/doctor', function (req, res) {
    console.log("post doctor")
    var doctor = new Doctor({
        "fullname" : req.body.fullname,
        "password" : req.body.password
    })
    console.log(req.body.fullname)
    doctor.save(function (err) {
        if (err)
            console.log(err)
        else
            console.log("record created")
    })
})


app.post('/patient', function (req, res) {
    console.log("post patient")
    console.log(req.body.familyDoctor.fullname)
    var id = req.body._id;
    var patient = new Patient({
        "firstname" : req.body.firstname,
        "lastname" : req.body.lastname,
        "email" : req.body.email,
        "age" : req.body.age,
        "familyDoctor":req.body.familyDoctor.fullname
    })
    //var p = new Patient(req.body);
    
//    Patient.findOneAndUpdate({_id: p._id},p,{upsert:true}, function(err,patients){
// 	})
    Patient.find({_id:req.body._id},function(err,patients){
        console.log(patients.length);
        console.log(req.body);
        if(patients.length > 0){
            Patient.update({_id:req.body._id},
                           {firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age, familyDoctor: req.body.familyDoctor.fullname},
                           function(err,affected) {
                if(err){
                    console.log(err);
                }
                else{
                    res.status(200).send("record updated")
                }
			});
			console.log('update') 
        }
        else if(patients.length == 0){
            patient.save(function(err){
				if(err){
					res.status(409).send('Duplicate record')
					console.log(err)
				}
				else
					console.log("Patient: "+req.body.firstname+" "+req.body.lastname+"record created")
			})
        }
    })
})
    
app.get('/patient/:lastname', function (req, res) {
    var query = new RegExp(req.params.lastname, 'i');
    if(req.params.lastname){
    Patient.find({ lastname: query },function (err, patients) {
            res.send(patients)
    })
}
})    

app.post('/deletepatient', function (req,res){
    Patient.find({_id: req.body._id}).remove().exec();
    console.log("Patient REmoved");
})

app.get('/getpatients', function (req, res) {
    
    console.log("get patients")
    Patient.find(function (err, patients) {
        if (err)
            console.log(err)
        else
            return res.json(patients)
    })
})



app.get('/getdoctors', function (req, res) {
    console.log("get doctors")
    Doctor.find(function (err, doctor) {
        if (err)
            console.log(err)
        else
            return res.json(doctor)
    })
})
//for login
app.get('/getDoctor', function (req, res) {
    var fullname = req.query.fullname;
		Doctor.findOne({
			fullname: fullname
		}, function (err, data) {
			if (err) {
				console.log(err);
			} else {
				res.status(200).send(data);
			}
		})
})

app.get('/getpatients/:lastname', function (req, res) {
    console.log("get patients")
    Patient.findOne({ "lastname": req.params.lastname },function (err, patients) {
        if (err)
            console.log(err)
        else
            return res.json(patients)
    })
})


app.listen(process.env.PORT || 3000)