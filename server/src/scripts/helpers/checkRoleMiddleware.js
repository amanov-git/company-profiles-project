const checkRoleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    const user = req.user;

    const hasPermission = requiredRoles.some((role) => role === user.role);
    
    if (!hasPermission) {
      return res.sendStatus(403);
    };

    next();
  };
};

module.exports = checkRoleMiddleware;