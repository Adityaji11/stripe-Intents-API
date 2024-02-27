import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51Oo0IhSAHiZKGOyKqdKk8VxOLRKO7cZq6SMHjeFiWe54pLkjo4osFTDX7LUEMozAs2axFAftsC01qCJRuHivlUVd006aJ2d5Q8');

const PaymentForm = () => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleBuyNowClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/payment-intent', { 
        amount: paymentAmount,
        description: 'Payment for goods',
        billing_details: {
          name: 'John Doe',
          address: {
            line1: '123 Main St',
            city: 'Anytown',
            postal_code: '12345',
            country: 'US'
          }
        }
      });
      setPaymentIntentClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error('Error fetching payment intent:', error);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('CardElement not found.');
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentClientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'John Doe',
          address: {
            line1: '123 Main St',
            city: 'Anytown',
            postal_code: '12345',
            country: 'US'
          }
        }
      }
    });

    if (error) {
      console.error('Payment failed:', error);
    } else {
      console.log('Payment succeeded:', paymentIntent);
      setPaymentComplete(true);
    }
  };

  const handleAmountChange = (e) => {
    setPaymentAmount(e.target.value);
  };

  return (
    <div>
      <h1>Welcome to our Simple Payment Page</h1>
      {paymentComplete ? (
        <div>
          <h2>Thank you for your payment!</h2>
          {/* Display any additional information or a thank you message */}
        </div>
      ) : (
        <div>
          <p>Please enter the payment amount:</p>
          <input type="number" value={paymentAmount} onChange={handleAmountChange} />
          <button onClick={handleBuyNowClick}>Buy Now</button>
          {paymentIntentClientSecret && (
            <div>
              <h2>Complete Payment</h2>
              <CardElement />
              <button onClick={handlePaymentSubmit}>Complete Payment</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default App;


