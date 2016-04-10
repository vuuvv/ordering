function login(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'You need login');
		return res.redirect('/login');
	}
}

module.exports = {
	login: login
};