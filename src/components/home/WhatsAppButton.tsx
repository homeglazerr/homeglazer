
import React from 'react';

const WhatsAppButton: React.FC = () => {
  return (
    <a 
      href="https://wa.me/919717256514"
      className="fixed bottom-[95px] md:bottom-6 right-5 md:right-6 z-[60] group flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
        
        {/* WhatsApp Button Container */}
        <div className="relative bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center">
          {/* Official WhatsApp SVG Logo */}
          <svg 
            className="w-7 h-7 md:w-8 md:h-8 fill-current" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.005 4.995A9.943 9.943 0 0 0 12.003 2c-5.518 0-10.005 4.487-10.005 10.005 0 1.764.46 3.488 1.332 5.005L2 22l5.12-1.34A9.92 9.92 0 0 0 12.003 22c5.518 0 10.005-4.487 10.005-10.005 0-2.673-1.042-5.186-2.998-7.005zM12.003 20.2c-1.542 0-3.048-.415-4.368-1.2l-.313-.187-3.245.85.865-3.164-.205-.327A8.18 8.18 0 0 1 3.8 12.005c0-4.523 3.68-8.205 8.203-8.205 2.19 0 4.248.853 5.797 2.402a8.146 8.146 0 0 1 2.402 5.798c0 4.523-3.68 8.205-8.199 8.205zm4.5-6.143c-.247-.124-1.464-.723-1.692-.806-.228-.083-.394-.124-.559.124-.165.247-.64.806-.784.97-.144.166-.289.186-.536.062a6.764 6.764 0 0 1-1.99-1.229 7.442 7.442 0 0 1-1.378-1.716c-.144-.247-.015-.38.109-.504.111-.11.247-.289.371-.433.124-.144.165-.247.247-.413.083-.165.042-.31-.02-.433-.062-.124-.559-1.343-.765-1.839-.2-.485-.403-.418-.559-.426-.144-.008-.31-.008-.475-.008s-.433.062-.66.31c-.227.247-.866.847-.866 2.067s.887 2.397 1.011 2.562c.124.165 1.747 2.668 4.232 3.74.591.255 1.053.407 1.413.521.593.188 1.133.161 1.56.098.476-.07 1.464-.599 1.67-.178.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z"/>
          </svg>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;

