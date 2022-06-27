import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PayOptionPage() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentOption },
  } = state;

  const [payOptionName, setpaymentOption] = useState(paymentOption || 'PayPal');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/checkout');
    }
  }, [shippingAddress, navigate]);
  const submit = (e) => {
    e.preventDefault();
    contextDispatch({
      type: 'PAYMENT_OPTION',
      payload: payOptionName,
    });
    localStorage.setItem('paymentOption', payOptionName);
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submit}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={payOptionName === 'PayPal'}
              onChange={(e) => setpaymentOption(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={payOptionName === 'Stripe'}
              onChange={(e) => setpaymentOption(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
