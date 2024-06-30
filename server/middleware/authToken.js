const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = userData;
    next();
  });
};

module.exports = { authMiddleware };
