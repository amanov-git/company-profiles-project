const jwt = require('jsonwebtoken');

const checkUserIdMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  const { userID } = req.params;

  if (!auth) {
    return res.sendStatus(401);
  };

  const token = auth.split(' ')[1];

  const decoded = jwt.decode(token);

  if (!decoded) {
    return res.status(401).send('Unauthorized.');
  };


  if (decoded.id !== Number(userID)) {
    return res.sendStatus(403);
  };

  next();

};

module.exports = checkUserIdMiddleware;