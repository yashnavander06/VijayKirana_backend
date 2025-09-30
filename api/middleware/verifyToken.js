const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Verify token from headers
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token || req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user; // decoded payload { id, admin, iat, exp }
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// ✅ User can access their own account OR admin can too
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.admin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

// ✅ Admin only (double check: JWT + DB)
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const dbUser = await User.findById(req.user.id);

      if (!dbUser) {
        return res.status(404).json("User not found!");
      }

      if (dbUser.admin === true) {
        next();
      } else {
        res.status(403).json("Admin privileges required!");
      }
    } catch (err) {
      console.error("Admin check failed:", err);
      res.status(500).json("Server error in admin check!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
