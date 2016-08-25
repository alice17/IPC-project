var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var data = require('./models/auth')();

module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user_id, done) {
        new data.ApiUser({id: user_id}).fetch().then(function(user) {
            return done(null, user);
        }, function(error) {
            return done(error);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'usr',
        passwordField: 'pwd',
        passReqToCallback : true
    },function(req, name, password, done) {
        console.log(name);
        console.log(password);

        req.flash('username', name);
        // req.checkBody('usr', 'Please enter a name.').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var msg = errors[0].msg;
            req.flash('error', msg);
            res.redirect('/login');
            return;
        }

        var pwd = crypto.createHmac('sha256', password);

        var user = new data.ApiUser({username: name, password: pwd, level: 1, score: 0}).save().then(function(model) {
            passport.authenticate('local-login')(req, res, function () {
                redirectToGame(res, req);
            })
            return done(null, user);
        }, function(err) {
            return done(err);
            // req.flash('error', 'Unable to create account.');
            // res.redirect('/login');
        });
    }));

    // =========================================================================
    // LOCAL LOGIN ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true
    },function(name, password, done) {
        // TODO correggi i campi necessari per il login utente
        new data.ApiUser({username: name}).fetch({require: true}).then(function(user) {
            var sa = user.get('salt');
            var pw = user.get('password');
            var upw = crypto.createHmac('sha1', sa).update(password).digest('hex');
            if(upw == pw) {
                return done(null, user);
            }
            return done(null, false, { 'message': 'Invalid password'});
        }, function(error) {
            // registro il nuovo utente

            return done(null, false, { 'message': 'Unknown user'});
        });
    }));
};
