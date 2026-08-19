import React from 'react';
import { Phone } from 'lucide-react';

const CallButton: React.FC = () => {
  return (
    <a
      href="tel:+919717256514"
      aria-label="Call us"
      className="fixed bottom-[165px] md:bottom-[92px] right-5 md:right-6 z-[60] group flex items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#299dd7]/40 animate-ping" />
        
        {/* Call Button Container */}
        <div className="relative bg-[#299dd7] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#2080b8] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center">
          <Phone className="w-7 h-7 md:w-8 md:h-8" />
        </div>
      </div>
    </a>
  );
};

export default CallButton;

