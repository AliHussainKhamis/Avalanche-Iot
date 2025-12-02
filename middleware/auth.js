function isAuthenticated(req, res, next) {
  if (req.session.user) return next(); // check for user, not userId
  res.redirect('/login');
}

module.exports = isAuthenticated;
