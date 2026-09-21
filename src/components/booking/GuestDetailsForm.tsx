'use client';

import React, { useState } from 'react';

interface GuestData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  nationality: string;
  govtIdType: string;
  govtIdNumber: string;
}

interface GuestDetailsFormProps {
  onSubmit: (data: GuestData) => void;
  initialData?: Partial<GuestData>;
}

export function GuestDetailsForm({ onSubmit, initialData }: GuestDetailsFormProps) {
  const [formData, setFormData] = useState<GuestData>({
    guestName: initialData?.guestName || '',
    guestEmail: initialData?.guestEmail || '',
    guestPhone: initialData?.guestPhone || '',
    nationality: initialData?.nationality || 'Indian',
    govtIdType: initialData?.govtIdType || 'Aadhaar',
    govtIdNumber: initialData?.govtIdNumber || '',
  });

  const [errors, setErrors] = useState<Partial<GuestData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name as keyof GuestData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<GuestData> = {};
    if (!formData.guestName) newErrors.guestName = 'Name is required';
    if (!formData.guestEmail || !/\S+@\S+\.\S+/.test(formData.guestEmail)) newErrors.guestEmail = 'Valid email is required';
    if (!formData.guestPhone || formData.guestPhone.length < 10) newErrors.guestPhone = 'Valid phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label>
          <input 
            type="text" 
            name="guestName" 
            value={formData.guestName} 
            onChange={handleChange}
            className="w-full border border-sandstone focus:border-terracotta rounded-xl p-3 outline-none transition-colors"
          />
          {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
            <input 
              type="email" 
              name="guestEmail" 
              value={formData.guestEmail} 
              onChange={handleChange}
              className="w-full border border-sandstone focus:border-terracotta rounded-xl p-3 outline-none transition-colors"
            />
            {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Phone/WhatsApp *</label>
            <input 
              type="tel" 
              name="guestPhone" 
              value={formData.guestPhone} 
              onChange={handleChange}
              className="w-full border border-sandstone focus:border-terracotta rounded-xl p-3 outline-none transition-colors"
            />
            {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Nationality</label>
            <select 
              name="nationality" 
              value={formData.nationality} 
              onChange={handleChange}
              className="w-full border border-sandstone focus:border-terracotta rounded-xl p-3 outline-none transition-colors bg-white"
            >
              <option value="Indian">Indian</option>
              <option value="Foreigner">Foreigner</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Govt ID Type</label>
            <select 
              name="govtIdType" 
              value={formData.govtIdType} 
              onChange={handleChange}
              className="w-full border border-sandstone focus:border-terracotta rounded-xl p-3 outline-none transition-colors bg-white"
            >
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Govt ID Number</label>
            <input 
              type="text" 
              name="govtIdNumber" 
              value={formData.govtIdNumber} 
              onChange={handleChange}
              className="w-full border border-sandstone focus:border-terracotta rounded-xl p-3 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-terracotta text-white font-medium py-3 rounded-xl hover:bg-[#a04e2d] transition-colors"
      >
        Continue to Payment
      </button>
    </form>
  );
}
