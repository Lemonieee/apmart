import jwt from 'jsonwebtoken';

//to send token along with the data while signing in
export const generateToken = (user) => {
  //
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    //secret string to encrypt data
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      //callback function
      //decode is the decrypted version of the token that includes user information
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          //next() is to go to orderRoutes
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

//middleware to authenticate admin users
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
