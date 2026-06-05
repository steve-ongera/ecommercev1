import { useSelector } from 'react-redux';

const OrderSummary = ({ coupon, discountAmount }) => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  
  const subtotal = totalAmount;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.1;
  const finalTotal = subtotal + shipping + tax - (discountAmount || 0);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        {coupon && (
          <div className="text-sm text-green-600">
            Coupon applied: {coupon.code}
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Items in Cart ({items.length})</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 text-sm">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">
                  Qty: {item.quantity} × ${item.price}
                </p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;