'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { X, CheckCircle2, AlertCircle, Loader2, Sparkles, Send } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';

const STORAGE_KEY = 'homeglazer:contact-form-popup-dismissed';
const POPUP_DELAY_MS = 5000; // 5 seconds for smooth prompt

const ContactFormPopup: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const {
    formData,
    errors,
    isSubmitting,
    submitted,
    submitError,
    handleChange,
    handleSubmit,
    resetForm,
  } = useContactForm();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      setShowPopup(false);
      return;
    }

    setShowPopup(false);
    const timer = setTimeout(() => setShowPopup(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [mounted, router.asPath]);

  const dismissPermanently = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    setShowPopup(false);
  };

  const dismissTemporarily = () => {
    setShowPopup(false);
  };

  if (!mounted || !showPopup || typeof document === 'undefined') {
    return null;
  }

  const inputBaseClass =
    'border bg-white w-full text-sm text-gray-800 font-medium px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:border-[#ED276E] focus:ring-2 focus:ring-[#ED276E]/20 disabled:opacity-50 disabled:cursor-not-allowed';
  const inputErrorClass = 'border-red-500 ring-2 ring-red-500/10';
  const inputNormalClass = 'border-gray-200';

  const popupContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Get Free Painting Estimate"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={dismissTemporarily}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-[460px] max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/40 transform transition-all duration-300 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner - Pink to Blue Brand Gradient */}
        <div className="relative bg-gradient-to-r from-[#ED276E] to-[#299dd7] p-6 text-white overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <button
            type="button"
            onClick={dismissPermanently}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-md shadow-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> HomeGlazer Express Consultation
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Get Free Painting Estimate
          </h2>
          <p className="text-white/90 text-sm font-light">
            Book a complimentary site visit & color advice in 60 seconds.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Enquiry Received!</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                Thank you for contacting HomeGlazer. Our painting expert will call you shortly.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white px-8 py-3 rounded-full text-sm font-semibold hover:opacity-95 transition-all shadow-md mt-2"
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{submitError}</p>
                </div>
              )}

              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                  className={`${inputBaseClass} ${errors.name ? inputErrorClass : inputNormalClass}`}
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    disabled={isSubmitting}
                    className={`${inputBaseClass} ${errors.mobile ? inputErrorClass : inputNormalClass}`}
                    required
                  />
                  {errors.mobile && (
                    <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    disabled={isSubmitting}
                    className={`${inputBaseClass} ${errors.email ? inputErrorClass : inputNormalClass}`}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Project Details / Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your home, flat size, or required service..."
                  disabled={isSubmitting}
                  rows={3}
                  className={`${inputBaseClass} resize-none ${errors.message ? inputErrorClass : inputNormalClass}`}
                  required
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#ED276E] to-[#299dd7] hover:opacity-95 text-white font-bold text-base py-3.5 px-6 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Estimate Request...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Request Free Site Visit
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-2">
                🔒 100% Privacy Guaranteed. No spam calls.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
};

export default ContactFormPopup;
