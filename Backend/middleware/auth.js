const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Extract user ID and user type from the token
    const decoded = jwt.verify(token.split(' ')[1], 'Hello-there');
    console.log(decoded); // Log the decoded token to check its content
    req.userId = decoded.userId;
    req.userType = decoded.userType 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
