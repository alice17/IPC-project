
exports.logout = function(req, res) {
	console.log('Log out...');
	console.log('-----------');
    req.logout();
    req.flash('info', 'You are now logged out.');
    res.redirect('/');
}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
    	return next();
    } else {
    	res.render('login', { message: req.flash('loginMessage') });
	}
}

exports.ensureSignedUp = function(req, res, next) {
    if (req.isAuthenticated()) {
    	return next();
    } else {
    	res.render('signup', { message: req.flash('signupMessage') });
	}
}

exports.gameIndex = function(req, res) {
	console.log('Game index requested.');
    res.render('index', { username: req.user.get('username')});
}
