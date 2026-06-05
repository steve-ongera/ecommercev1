import { useState } from 'react';

const AddressForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="input"
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 *
        </label>
        <input
          type="text"
          name="addressLine1"
          required
          className="input"
          value={formData.addressLine1}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          name="addressLine2"
          className="input"
          value={formData.addressLine2}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            className="input"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            name="state"
            required
            className="input"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            name="zipCode"
            required
            className="input"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            name="country"
            required
            className="input"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          required
          className="input"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Continue to Payment
      </button>
    </form>
  );
};

export default AddressForm;