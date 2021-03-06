import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { useContext, useEffect, useState } from 'react';
import { getError } from '../utils';

export default function SignInPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  //redirectURL is 'shipping'
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectUrl ? redirectUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState('');

  const { state, dispatch: contextDispatch } = useContext(Store);
  const { userInfo } = state;

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      contextDispatch({ type: 'SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      //redirect to the prev page if exists, to homepage if doesn't exist
      toast.success('Sign in successfully!');
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setShowPassword(!showPassword);
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={signIn}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div
          className="mb-3"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Button onClick={togglePassword}>Show Password</Button>
          <Button type="submit">Sign In</Button>
        </div>

        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
