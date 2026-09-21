'use client';

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function WhatsAppFAB() {
  const [isHovered, setIsHovered] = useState(false);
  
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const text = encodeURIComponent("Hi! I'd like to know about rooms at House Of Karma, Leh.");
  const url = `https://wa.me/${whatsappNumber}?text=${text}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse effect background */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75 group-hover:hidden"></div>
      
      {/* Button container with dynamic width for hover effect */}
      <div className="relative flex items-center bg-[#25D366] text-white rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out h-14 w-14 md:h-[60px] md:w-[60px] group-hover:w-auto">
        <div className="flex items-center justify-center h-full w-14 md:w-[60px] shrink-0">
          <MessageCircle size={28} className="fill-white/20" />
        </div>
        
        {/* Expanded text */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap font-body font-medium ${isHovered ? 'w-24 pr-5 opacity-100' : 'w-0 opacity-0'}`}>
          Chat with us
        </div>
      </div>
    </a>
  );
}
