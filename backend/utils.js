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
