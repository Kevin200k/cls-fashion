const requireVerification = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    if (!decoded.isVerified) {
      return res.status(403).json({ message: 'Please verify your account to access this feature.' });
    }
  
    next();
  };

  export default requireVerification