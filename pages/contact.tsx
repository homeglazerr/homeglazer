import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getOgImageUrl } from '@/lib/mediaUrl';
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppButton from '@/components/home/WhatsAppButton';
import CallButton from '@/components/home/CallButton';
import { MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const contactPageFaq: FAQItem[] = [
  {
    question: 'How quickly will HomeGlazer respond after I use the contact form?',
    answer:
      'We aim to reply within one working day for most messages, often sooner during business hours. If your note is urgent—water damage, a handover deadline, or a site shutdown—say so in the subject line of your message and we will prioritise. Weekends and public holidays may add a short delay, but we do not leave people hanging without an acknowledgement.',
  },
  {
    question: 'What should I write so you can quote accurately?',
    answer:
      'City and sector, approximate carpet or built-up area, type of property, and whether the job is empty or occupied all help. Mention surfaces (walls only, ceiling, woodwork, exterior), current condition, and any brand or finish preference. Photos over WhatsApp or email after first contact speed things up enormously. If you are unsure, say that—we will ask the right follow-up questions on a call.',
  },
  {
    question: 'Do you visit the site before confirming a price?',
    answer:
      'For most substantial interior or exterior work, yes. Measurements, substrate checks, masking complexity, and access affect both material quantities and labour days. A site visit protects you from a number that looks cheap on paper and balloons later. Smaller or remote scoping starts can sometimes begin with photos and a video call; we will tell you honestly which path fits.',
  },
  {
    question: 'Is the contact form different from the enquiry page?',
    answer:
      'Both reach our team. The structured enquiry flow on /enquiry is ideal when you already know service type and want a guided set of fields. This contact page suits open questions, partnership notes, media requests, or when you prefer a free-form message. Pick whichever you find faster—we read both queues.',
  },
  {
    question: 'Which areas do you serve?',
    answer:
      'We work across Delhi NCR and nearby locations. If you are on the edge of our regular zone, send the pin or society name and we will confirm travel feasibility before booking a visit.',
  },
  {
    question: 'Can I discuss budget before committing to a site visit?',
    answer:
      'Absolutely. Many clients run the paint budget calculator or painting cost calculator first, then share that range with us. We can say whether your scope is realistic, what trade-offs exist (fewer coats versus a premium line, phased rooms versus whole flat), and where money usually goes—prep, product, or protection—not as a sales script, but as planning.',
  },
  {
    question: 'Which paint brands do you work with?',
    answer:
      'We routinely specify Asian Paints, Dulux, Nerolac, Berger, and other major brands depending on site needs and your preference. If you already have a loyalty to one catalogue, mention it in your message. For colour exploration before you lock a code, the colour visualiser on our site is a useful companion to the conversation.',
  },
  {
    question: 'Can I visit your office instead of only calling?',
    answer:
      'You are welcome to coordinate an office visit if you prefer face-to-face discussion. Phone and WhatsApp remain the fastest way to get on the calendar for a site survey. Use the map on this page for directions to Sangam Vihar, New Delhi.',
  },
];

const ContactPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  
  // Success state
  const [submitted, setSubmitted] = useState(false);
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error state for API errors
  const [submitError, setSubmitError] = useState('');
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user types
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    
    // Validate phone
    const phoneRegex = /^[0-9+\- ]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }
    
    // Validate service
    if (!formData.service) {
      newErrors.service = 'Please select a service';
      valid = false;
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Success
      setSubmitted(true);
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setSubmitError(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | HomeGlazer - Get in Touch</title>
        <meta
          name="description"
          content="Contact HomeGlazer in New Delhi for painting, textures, wood polishing, and renovation. Phone, email, map, and message form. Fast replies, site visits across Delhi NCR, and clear next steps."
        />
        <meta property="og:title" content="Contact Us | HomeGlazer - Get in Touch" />
        <meta
          property="og:description"
          content="Reach HomeGlazer by phone, email, or form. Office in New Delhi; painting and wood services across Delhi NCR."
        />
        <meta property="og:image" content={getOgImageUrl("/uploads/services/contact-hero.jpg", SITE_URL)} />
        <meta name="twitter:title" content="Contact Us | HomeGlazer - Get in Touch" />
        <meta name="twitter:description" content="Phone, email, map, and form—HomeGlazer for painting and wood work across Delhi NCR." />
        <meta name="twitter:image" content={getOgImageUrl("/uploads/services/contact-hero.jpg", SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(contactPageFaq)} />
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />
      
      {/* Breadcrumb */}
      <div className="w-[90%] lg:w-[80%] mx-auto pt-28 flex justify-center">
        <Breadcrumb className="w-full max-w-none flex justify-center">
          <BreadcrumbList className="justify-center">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/contact">Contact Us</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Hero Banner with Background Image */}
      <section className="w-full py-20 mt-6 relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-cover bg-center z-0" 
             style={{ 
               backgroundImage: 'url("/uploads/services/contact-hero.jpg")'
             }}>
          <div className="absolute inset-0 bg-[#ED276E] opacity-80"></div>
        </div>
        
        {/* Content */}
        <div className="w-[90%] lg:w-[80%] mx-auto text-center relative z-10">
          <h1 className="text-[40px] md:text-[48px] font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
            We're here to help with all your painting and renovation needs. Reach out to our team for personalized assistance and expert advice.
          </p>
        </div>
      </section>
      
      {/* Branch Information and Contact Form */}
      <section className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Branch Information */}
          <div className="space-y-12">
            {/* Office Information */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-[#299dd7]">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#ED276E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">H-16/137 Sangam Vihar, New Delhi, 110080</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#ED276E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+91-9717256514</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#ED276E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">homeglazer@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Maps Embed */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-[#299dd7]">Find Us on Map</h2>
              <div className="w-full overflow-hidden rounded-lg">
                <iframe
                  title="HomeGlazer office location on Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.217616931312!2d77.25132260000001!3d28.503099699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce10fc59c7de5%3A0x2894b4de983ee057!2sHome%20Glazer!5e0!3m2!1sen!2sin!4v1765807245812!5m2!1sen!2sin" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Contact Form with Validation */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 self-start">
            <h2 className="text-2xl font-semibold mb-6 text-[#299dd7]">Send Us a Message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <svg 
                  className="w-16 h-16 text-green-500 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="text-xl font-medium text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700">
                  Your message has been sent successfully. We'll get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#ED276E] focus:border-[#ED276E] outline-none`} 
                    placeholder="Your name" 
                  />
                  {errors.name && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#ED276E] focus:border-[#ED276E] outline-none`} 
                    placeholder="your.email@example.com" 
                  />
                  {errors.email && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#ED276E] focus:border-[#ED276E] outline-none`} 
                    placeholder="+91 12345 67890" 
                  />
                  {errors.phone && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service Required*</label>
                  <select 
                    id="service" 
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.service ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#ED276E] focus:border-[#ED276E] outline-none`}
                  >
                    <option value="">Select a service</option>
                    <option value="interior">Interior Painting</option>
                    <option value="exterior">Exterior Painting</option>
                    <option value="texture">Texture Painting</option>
                    <option value="stencil">Stencil Painting</option>
                    <option value="wood-polish">Wood Polishing</option>
                    <option value="wood-coat">Wood Coating</option>
                    <option value="carpentry">Carpentry Services</option>
                  </select>
                  {errors.service && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.service}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message*</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-[#ED276E] focus:border-[#ED276E] outline-none`} 
                    placeholder="Tell us about your project..."
                  ></textarea>
                  {errors.message && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.message}</span>
                    </div>
                  )}
                </div>
                
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>{submitError}</span>
                    </div>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#ED276E] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#d51e5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto py-12 md:py-16 border-t border-gray-100 text-left">
        <article className="prose prose-lg max-w-none text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Why this page exists—and what happens next</h2>
          <p className="mb-5">
            Renovation chats usually start in a hurry: a festival deadline, a lease handover, or paint that failed after
            the monsoon. A contact form cannot replace a conversation, but it does give both sides a paper trail—scope
            hints, phone number, and the service line you care about—before anyone travels. We read every message; the
            only variable is how much detail you provide up front. The more context, the fewer back-and-forth pings.
          </p>
          <p className="mb-5">
            If you already know you want a structured quote path, the{' '}
            <Link href="/enquiry" className={linkClass}>
              enquiry form
            </Link>{' '}
            walks you through fields we often need. Prefer to browse numbers first? The{' '}
            <Link href="/paint-budget-calculator" className={linkClass}>
              paint budget calculator
            </Link>{' '}
            and{' '}
            <Link href="/calculator/painting" className={linkClass}>
              painting cost calculator
            </Link>{' '}
            help anchor expectations. Wood-heavy scopes pair naturally with the{' '}
            <Link href="/calculator/wood-polishing" className={linkClass}>
              wood polishing calculator
            </Link>
            . None of those replace a site visit—they simply make the first call productive instead of vague.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>How we think about fair pricing</h2>
          <p className="mb-5">
            <strong>Prep is not optional fluff.</strong> Cracks, damp patches, chalky old emulsion, or glossy surfaces
            without proper keying will fight any new coat. We quote preparation honestly because skipping it is how jobs
            peel in six months—and nobody wants that dispute.
          </p>
          <p className="mb-5">
            <strong>Product tiers are real.</strong> Economy, mid, and premium lines differ in resin, washability, and
            warranty. We are brand-flexible within quality bands; if you have a favourite catalogue, say so. If you only
            have a budget ceiling, say that too and we will map realistic systems.
          </p>
          <p className="mb-5">
            <strong>Occupied sites cost attention.</strong> Furniture movement, dust control, and working around children
            or WFH schedules slow the rhythm compared with an empty flat. That is not a penalty—it is the cost of care.
            When you mention occupancy in your message, our proposal reflects reality.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Residential, commercial, and mixed-use</h2>
          <p className="mb-5">
            Homes dominate our inbox, but offices, retail fronts, and small hospitality refreshes follow the same
            principle: clarify traffic pattern, brand guidelines if any, and after-hours access. Our{' '}
            <Link href="/painting-services" className={linkClass}>
              painting services
            </Link>{' '}
            hub links deeper into residential and commercial pages. If your note sits between categories—say a studio
            with a shopfront—describe it in plain language; we will route it to the right estimator.
          </p>
          <p className="mb-5">
            Colour decisions often run parallel to procurement. Clients frequently shortlist shades on the{' '}
            <Link href="/colour-visualiser" className={linkClass}>
              colour visualiser
            </Link>{' '}
            before locking a code with us. That order works well: creative comfort first, then technical confirmation on
            primer, sheen, and litres.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>After you hit send</h2>
          <p className="mb-5">
            Expect an acknowledgement and a short set of clarifying questions if needed. For local projects we usually
            propose a survey window; for exploratory messages we may reply with a ballpark range and the assumptions
            behind it. Nothing commits you until a written quote and schedule look right to you. If something changes on
            your side—dates, budget, or scope—just reply on the same thread; we keep history together.
          </p>
          <p className="mb-5">
            For policies that apply to every engagement—crew size, materials, how site managers communicate—our{' '}
            <Link href="/faq" className={linkClass}>
              FAQ
            </Link>{' '}
            page is worth a skim. It complements this contact route rather than replacing it.
          </p>
        </article>
      </section>

      <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto pb-12 md:pb-16 text-center">
        <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">Frequently asked questions</h2>
        <p className="text-[rgba(64,80,94,1)] mb-6 mx-auto max-w-2xl text-base md:text-lg font-light">
          Responses, quoting, areas we cover, and how contact compares to other forms. More general topics live on the{' '}
          <Link href="/faq" className={linkClass}>
            main FAQ
          </Link>
          .
        </p>
        <Accordion type="single" collapsible className="w-full space-y-3 text-left">
          {contactPageFaq.map((item, index) => (
            <AccordionItem
              key={`contact-faq-${index}`}
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg px-1 bg-gray-50/50"
            >
              <AccordionTrigger className="px-4 py-4 text-left font-semibold text-gray-900 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-700 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#ED276E] to-[#299dd7] w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-[40px] font-medium mb-6">Ready to Transform Your Space?</h2>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Get in touch today for a free consultation and quote. Let our experts bring your vision to life.
          </p>
          <div className="inline-block">
            <a 
              href="/paint-budget-calculator" 
              className="bg-transparent border-2 border-white text-white hover:bg-[#0FA0CE] hover:border-[#0FA0CE] transition-colors duration-300 font-medium rounded-full px-8 py-4 text-lg"
            >
              Try Our Budget Calculator
            </a>
          </div>
        </div>
      </section>
      
      {/* Mobile Action Buttons - Fixed at Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex gap-3">
          <Link href="/enquiry" className="flex-1 bg-[#ED276E] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#b81d5a] transition flex items-center justify-center text-[15px]">
            Enquire Now
          </Link>
          <Link href="/paint-budget-calculator" className="flex-1 bg-[#299dd7] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px]">
            Budget Calculator
          </Link>
        </div>
      </div>
      
      <Footer />
        <CallButton />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default ContactPage; 