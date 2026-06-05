import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from 'react-icons/fa';

const PaymentForm = ({ onSubmit, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod: stripeMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setCardError(error.message);
        return;
      }

      onSubmit({ paymentMethod: 'card', paymentMethodId: stripeMethod.id });
    } else {
      onSubmit({ paymentMethod: 'paypal' });
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Payment Method
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex-1">
              <span className="font-medium">Credit / Debit Card</span>
            </div>
            <div className="flex gap-2 text-gray-400">
              <FaCcVisa className="text-2xl" />
              <FaCcMastercard className="text-2xl" />
              <FaCcAmex className="text-2xl" />
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex-1">
              <span className="font-medium">PayPal</span>
            </div>
            <FaPaypal className="text-2xl text-blue-500" />
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border rounded-lg p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <p className="mt-2 text-sm text-red-600">{cardError}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || (paymentMethod === 'card' && cardError)}
        className="btn-primary w-full"
      >
        {loading ? 'Processing...' : `Pay Now`}
      </button>
    </form>
  );
};

export default PaymentForm;