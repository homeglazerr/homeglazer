import React from 'react';
import DelhiServicePage from '@/components/location/DelhiServicePage';

export default function CommercialPaintingContractorsInDelhi() {
  return (
    <DelhiServicePage
      pageTitle="Commercial Painting Contractors in Delhi | Office & Shop Painters | Home Glazer"
      metaDescription="Leading commercial painting contractors in Delhi NCR. Professional painters for offices, retail stores, IT parks, hotels, hospitals & commercial buildings. Off-hours execution!"
      canonicalSlug="commercial-painting-contractors-in-delhi"
      breadcrumbLabel="Commercial Painting Contractors in Delhi"
      h1Title="Commercial Painting Contractors in Delhi"
      heroSubtitle="Professional painting solutions for offices, shops, retail stores, and commercial spaces in Delhi NCR. Minimal business disruption."
      heroImage="/uploads/services/commercial-hero.jpg"
      badgeLabel="HOME GLAZER COMMERCIAL"
      aboutTitle="Home Glazer Commercial Painting Services in Delhi"
      aboutContent={[
        "Delhi NCR has been the hub of workplaces throughout the time and commercial painting is very important as colours make the difference between formal and informal. Commercial Painting is an art that speaks, we can always understand that the colour code of home and office is not the same. So, we provide commercial painting services to clients who want their workplaces to be painted with perfection.",
        "Home Glazer is professionally perfect for making your workplace look fabulous. We use the best quality colours and staff are trained in commercial painting. Our commercial painting services are already making some good names in many workplaces. The commercial area includes business areas, cafeterias, office buildings and so on.",
        "We are taking care of all your needs, be it small or big, Home Glazer will be with you. Many service providers' tools and paints are below the standards but our team will make you trust on quality and standards. The painting service we give is not for months but for years. The paint we use can withstand rough weather and is very much durable."
      ]}
      aboutImage="/uploads/services/commercial-intro.jpg"
      serviceFeaturesTitle="Our Commercial Painting Services"
      serviceFeaturesSubtitle="Comprehensive painting solutions tailored for different types of commercial spaces and requirements."
      serviceFeatures={[
        {
          title: "Office Painting",
          description: "Transform your office environment with professional painting services that create a productive and welcoming atmosphere.",
          imageUrl: "/uploads/services/commercial-intro.jpg",
          bulletPoints: [
            "Conference room painting",
            "Reception area painting",
            "Workspace painting",
            "Brand color integration"
          ]
        },
        {
          title: "Retail & Shop Painting",
          description: "Enhance your retail space with professional painting that attracts customers and creates an inviting shopping environment.",
          imageUrl: "/uploads/services/Retail%20&%20Shop%20Painting.png",
          bulletPoints: [
            "Storefront painting",
            "Display area painting",
            "Customer service areas",
            "Brand-consistent colors"
          ]
        },
        {
          title: "Industrial & Office Facade",
          description: "Durable painting solutions for warehouses, factories, and commercial building elevations with night-shift capability.",
          imageUrl: "/uploads/services/commercial-painter.jpg",
          bulletPoints: [
            "Warehouse & factory painting",
            "Safety marking & epoxy floors",
            "Night & weekend shifts",
            "GST invoicing & formal BOQ"
          ]
        }
      ]}
      processTitle="Our Commercial Painting Process"
      processSubtitle="Structured execution to ensure on-time delivery with zero business downtime."
      processSteps={[
        {
          title: "Site Assessment",
          desc: "We conduct a thorough assessment of your commercial space to understand the scope, requirements, and challenges."
        },
        {
          title: "Planning & Scheduling",
          desc: "We develop a detailed plan and schedule that minimizes disruption to your business operations."
        },
        {
          title: "Professional Execution",
          desc: "Our skilled team executes the project with precision, using commercial-grade materials and professional tools."
        },
        {
          title: "Quality Assurance",
          desc: "We conduct thorough quality inspections to ensure the finished result meets commercial standards."
        }
      ]}
      faqs={[
        {
          question: "Can your commercial painters work during night shifts in Delhi?",
          answer: "Yes! We specialize in off-hours execution. Our teams work during nights and weekends so your office or store in Delhi remains fully operational during business hours."
        },
        {
          question: "Do you provide GST invoices and formal tenders for commercial projects?",
          answer: "Yes, HomeGlazer is a registered corporate entity. We issue official GST tax invoices, formal BOQs, material test certificates, and written warranty contracts."
        },
        {
          question: "Which paint brands do you use for commercial projects?",
          answer: "We use commercial-grade heavy-duty products from Asian Paints, Berger, Kansai Nerolac, and JSW Paints based on the project specification."
        }
      ]}
    />
  );
}
