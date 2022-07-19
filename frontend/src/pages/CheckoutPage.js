import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { buyerDetails },
  } = state;
  const [fullName, setFullName] = useState(buyerDetails.fullName || '');
  const [buyerId, setBuyerId] = useState(buyerDetails.buyerId || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/checkout');
    }
  }, [userInfo, navigate]);
  const submit = (e) => {
    e.preventDefault();
    contextDispatch({
      type: 'BUYER_DETAILS',
      payload: {
        fullName,
        buyerId,
      },
    });
    localStorage.setItem(
      'buyerDetails',
      JSON.stringify({
        fullName,
        buyerId,
      })
    );
    navigate('/payment');
  };
  return (
    <div>
      <Helmet>
        <title>Checkout Page</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Customer Details</h1>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Student/Staff ID</Form.Label>
            <Form.Control
              value={buyerId}
              onChange={(e) => setBuyerId(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
