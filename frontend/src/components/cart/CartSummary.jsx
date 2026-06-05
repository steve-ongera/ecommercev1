import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, shipping, tax, discount, total, couponCode, onApplyCoupon, loading }) => {
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = e.target.elements.coupon.value;
    if (code) {
      onApplyCoupon(code);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
      
      <form onSubmit={handleApplyCoupon} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            name="coupon"
            placeholder="Coupon code"
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary"
          >
            Apply
          </button>
        </div>
      </form>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {couponCode && (
        <div className="mt-3 text-sm text-green-600">
          Coupon "{couponCode}" applied successfully!
        </div>
      )}
      
      <Link to="/checkout" className="btn-primary w-full block text-center mt-6">
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartSummary;