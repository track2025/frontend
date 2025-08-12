'use client';
import React from 'react';
// stripe for paymen get way
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// checkout main component import
import CheckoutMain from './mainCheckout';
// Set up the Stripe promise with your public key
//const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe("pk_test_51RtoE2LKgwVGDXMy4kFsRL5UhjGVQ3HxomMjZhpyPNs5aHvxHAR7hxSYpNzvAUAJzykgJSERI2kw8Pdq83bMlfr900QxXIfjKg");

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutMain />
    </Elements>
  );
}
