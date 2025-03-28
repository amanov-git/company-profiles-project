const jwt = require('jsonwebtoken');
const env = require('../../config');

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.sendStatus(401);
  };

  const accessToken = auth.split(' ')[1];

  jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    };

    req.user = user;

    next();
  });
};

module.exports = authenticate;