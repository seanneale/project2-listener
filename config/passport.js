
// Load passport local
var localStrategy = require('passport-local').Strategy;

// Load validator
var validator = require('validator');

// Load user model
var User = require('../models/user');

module.exports = function( passport ) {

  // Serialize user
  passport.serializeUser( function( user, done){
      done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
        done(err, user);
      });
  });

  // Passport signup
  passport.use('local-signup', new localStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback: true
    },
    function( req, username, password, done){
        //check that the the username is unique

        // Check that the password is at least 8 chars
        if( password.length < 8 ){
          return done(null, false, req.flash('loginMessage','The password needs to be 8 chars long'));
        }

        process.nextTick(function(){
          User.findOne( {'username' : username }, function(err, user){
            if(err){
              return done(err);
            }
            if(user){
              return done(null, false, req.flash('loginMessage','That username is already in use'));
            }else{
              var newUser = new User();
              newUser.username = username;
              newUser.password = password;
              newUser.podcast = [];
              newUser.settings = {};
              newUser.lastLogin = Date();
              newUser.save(function(err){
                if(err){
                  console.log(err);
                }
                console.log('successful sign up');
                return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
              });
            }
          });
        });
    }));

  // Passport login
  passport.use('local-login', new localStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback: true
    },
    function( req, username, password, done){
        process.nextTick(function(){
          User.findOne( {'username' : username }, function(err, user){
            if(err){
              return done(err);
            }

            if(!user){
              return done(null,false, req.flash('loginMessage', 'sorry no one by that email'));
            }
            user.validPassword(password, function(err, isMatch){
              if(isMatch){
                console.log('success log in');
                return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
              } else {
                console.log('failure');
              }
              
              return done(null,false, req.flash('loginMessage', 'sorry wrong password'));
            })
          });
        });
    })
  
  );

}