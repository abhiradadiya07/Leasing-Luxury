const jwt = require("jsonwebtoken");
const UserModel = require("../model/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token,"token");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware };
