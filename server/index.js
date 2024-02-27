const express = require('express');
const stripe = require('stripe')('sk_test_51Oo0IhSAHiZKGOyKELoA7HXqSJvVFGrFEEMUKRJ3vONwvECULAZjMwjGf9VF2CJ47IUrq3oCuEfJTjfvCOSOaB3p00JDAXMtke');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Route to create a Payment Intent
app.post('/api/payment-intent', async (req, res) => {
  try {
    const { amount, description, customerData } = req.body;

    // Create a new customer
    const customer = await stripe.customers.create(customerData);

    // Create a Payment Intent with the specified amount, description, and customer ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency: 'usd', // Change currency if needed
      description: description, // Add description
      customer: customer.id, // Use the ID of the newly created customer
      // Add more options as needed, such as payment method types, metadata, etc.
    });

    // Send the client secret and payment intent ID to the client
    res.status(200).json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ error: 'An error occurred while creating Payment Intent' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
