import React from 'react';
import { formatPrice } from '@/lib/utils';

interface PriceBreakdownProps {
  roomName: string;
  pricePerNight: number;
  nights: number;
  taxRate?: number;
  taxAmount: number;
  totalAmount: number;
}

export function PriceBreakdown({ 
  roomName, 
  pricePerNight, 
  nights, 
  taxRate = 12, 
  taxAmount, 
  totalAmount 
}: PriceBreakdownProps) {
  const subtotal = pricePerNight * nights;

  return (
    <div className="bg-cream rounded-2xl p-6 shadow-sm border border-sandstone">
      <h3 className="font-heading text-xl text-charcoal mb-4 border-b border-sandstone pb-4">Booking Summary</h3>
      
      <div className="space-y-3 font-body text-charcoal">
        <div className="flex justify-between">
          <span className="font-medium">{roomName}</span>
          <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
        </div>
        
        <div className="flex justify-between text-sm text-slate">
          <span>{formatPrice(pricePerNight)} x {nights} nights</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm text-slate">
          <span>Taxes & Fees (GST)</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>

        <div className="my-4 border-t border-sandstone border-dashed"></div>

        <div className="flex justify-between items-center mt-4">
          <span className="font-medium text-lg">Total</span>
          <span className="font-heading text-2xl font-bold text-terracotta">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
