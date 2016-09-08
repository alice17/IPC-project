var loginController = require('./login');
var data = require('../models/auth')();
var fs = require('fs');	
var multer = require('multer');
var upload = multer({dest: 'public/img/avatars/'});


module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.redirect('/login');
    });

    app.get('/:type(index|home)', function(req, res) {
        res.redirect('/BarbarianSteppe');
    });

    app.get('/BarbarianSteppe', loginController.ensureAuthenticated, loginController.gameIndex);
    app.get('/login', loginController.ensureAuthenticated, loginController.gameIndex);
    app.get('/signup', loginController.ensureSignedUp, loginController.gameIndex);
    app.get('/logout', loginController.logout);

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/missile_command.js', function(req, res) {
      res.set('Content-Type', 'application/javascript');
//       console.log("Rendering missile_command file ...");

      new data.ApiUser({ username: req.user.get('username') }).fetch().then(function (model) {
          res.render('public/js/missile_command', {
          	level: model.get('level'),
          	score: model.get('score')
          });
      });
    });

    app.post('/saveUserState', function(req, res){
        console.log("Saving game state for " + req.user.get('username') + "...");
        var higerLevel = (req.body.level >= req.user.get('level')) ? req.body.level : req.user.get('level');

		// salvataggio nel DB
        new data.ApiUser({
        	id: req.user.get('id'),
        	username: req.user.get('username')
        }).save({
        	level: req.body.level,
        	score: req.body.score
        }, {patch: true}).then(function(model) {
            req.login(model, function(error) {
                if (!error) {
                   console.log('Succcessfully saved.');
                }
            });
            res.end();
        }, function(err) {
            console.log("Error while saving: " + err);
        });
    });
	
	app.post('/updateAvatar',  upload.single('avatar'), function(req,res){
		var stats = fs.statSync(req.file.path);
		var filesizeinMB = stats["size"] / 1000000.0;

		if(filesizeinMB < 5){
			var file = 'public/img/avatars/' + req.user.get('username');
			
			fs.rename(req.file.path, file, function(err) {
				if (err) {
					//console.log(err);
					res.send({
						error: true,
						message: 'Error. Can\'t upload avatar.'
					})
				} else {
					//console.log("Avatar updated.");
					res.send({
						error: false,
						message: 'Avatar updated.'
					})
				}
			});
		}else{
			//image size too big
			res.send({
				error: true,
				message: 'The avatar size must be smaller than 5 MB.'
			})
		}
	});
	
	app.get('/deleteAvatar', function(req,res){
		var file = 'public/img/avatars/' + req.user.get('username');
		
		fs.unlink(file, function(err) {
			if (err) {
				if(err.code=='ENOENT'){
					//console.log('Avatar already deleted.');
					res.send({
						error: true,
						message: 'Avatar already deleted.'
					})
				}else{
					//console.log('Cannot delete avatar');
					res.send({
						error: true,
						message: 'Cannot delete avatar.'
					});
				}
			} else {
				//console.log("Avatar deleted.");
				res.send({
					error: false,
					message: 'Avatar deleted.'
				});
			}
		});
	});

    app.get('/getUserData', function(req,res) {
        res.send({
			username: req.user.get('username'),
        	level: req.user.get('level'),
        	score: req.user.get('score')
        });
    });

    app.get('/getLeaderboard', function(req,res) {
        // new data.ApiUser().fetchAll().then(function (users) {
        //     users.forge().orderBy('score','DESC').then(function (orderedUsers) {
        //         res.send([
        //             {username: orderedUsers[0].get('username'), score: orderedUsers[0].get('score')},
        //             {username: orderedUsers[1].get('username'), score: orderedUsers[1].get('score')},
        //             {username: orderedUsers[2].get('username'), score: orderedUsers[2].get('score')}
        //         ]);
        //     });
        // });

        new data.ApiUser().fetchAll().then(function (User) {
            User.query(function(qb) {
                qb.orderBy('score', 'DESC');
            }).fetch({}).then(function(collection){
                // process results
                var users = collection.toJSON();

                res.send([
                    {username: users[0].username, score: users[0].score},
                    {username: users[1].username, score: users[1].score},
                    {username: users[2].username, score: users[2].score}
                ]);
            });
        });
    });

	// TODO eliminare nella versione definitiva
    app.get('/user', function(req, res) {
      new data.ApiUser().fetchAll().then(function(users) {
          res.send(users.toJSON());
        }).catch(function(error) {
          console.log(error);
          res.send('An error occured');
        });
    });

	// FIXME la pagina non compare quando l'URL e' nella forma localhost:3000/index/*
    app.get('*', function(req, res) {
    	res.render('404');
    });
}
