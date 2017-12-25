module.exports = function(req, res, next) {
  const { session } = req;

  if (!session.user) {
    session.user = { username: '', favorites: [] };
  }

  console.log(session);
  next();
};