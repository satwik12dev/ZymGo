const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const userRole = req.user.role_name?.toLowerCase();

    const hasAccess = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;