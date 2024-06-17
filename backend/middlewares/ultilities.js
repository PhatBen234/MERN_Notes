const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(401);

    const user = await User.findById(decoded.user); // Assuming decoded.user is the user ID
    if (!user) return res.sendStatus(401);

    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
