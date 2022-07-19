import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';

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

//sending email to customers
export const mailgun = () =>
  mg({
    apiKey: process.env.API_MAILGUN,
    domain: process.env.DOMAIN_MAILGUN,
  });

export const emailFormat = (order) => {
  return `<h1>Thanks for shopping with us!</h1>
  <p>
  Hi ${order.user.name},</p>
  <p>We are processing your order.</p>
  <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.quantity}</td>
    <td align="right"> RM ${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2"><strong>Total Price:</strong></td>
  <td align="right"><strong> RM ${order.total.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentOption}</td>
  </tr>
  </table>
  Thanks for shopping with us.
  </p>
  `;
};
