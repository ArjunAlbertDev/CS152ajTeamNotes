const
 createError = require('http-errors'),
 express = require('express'),
 path = require('path'),
 cookieParser = require('cookie-parser'),
 logger = require('morgan'),
 skillsController = require('./controllers/skillsController'),
 groupsController = require('./controllers/groupsController'),
 studentsController = require('./controllers/studentsController'),
 usersController = require('./controllers/usersController'),
 session = require("express-session"),
 bodyParser = require("body-parser"),
 User = require( './models/user' ),
 flash = require('connect-flash')


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

 // here we set up authentication with passport
 const passport = require('passport')
 const configPassport = require('./config/passport')
 configPassport(passport)


var app = express();

// skillsRouter = require('./routes/skills'),
const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/skillmastery' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});

var app = express();

// here is where we connect to the database!


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware to process the req object and make it more useful!
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
    if (req.user){
      if (req.user.googleemail=='arjunalbert@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'owner'
      } else {
        console.log('student has logged in')
        res.locals.status = 'regularUser'
      }
    }
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        }));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

// we require them to be logged in to see their profile
app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

// here are our regular app routes ...
// we require them to be logged in to access the skills page
app.get('/skills', skillsController.getAllSkills );
app.post('/saveSkill', isLoggedIn, skillsController.saveSkill );
app.post('/deleteSkill', isLoggedIn, skillsController.deleteSkill );


app.get('/groups',
         skillsController.attachSkills,
         groupsController.getAllGroups );
app.get('/groupItem/:id',
         groupsController.getGroupItem );
app.post('/saveGroup', isLoggedIn, groupsController.saveGroup );
app.post('/deleteGroup', isLoggedIn, groupsController.deleteGroup );
app.post('/shareGroup', isLoggedIn, groupsController.addUser );

app.get('/users',usersController.getAllUsers)
app.get('/users/:id',
        usersController.attachUser,
        groupsController.saveGroup,
        usersController.getUser)


app.use('/', function(req, res, next) {
  console.log("in / controller")
  res.render('index', { title: 'Team Notes App' });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
