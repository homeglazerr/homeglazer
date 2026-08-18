import React from 'react';
import DelhiServicePage from '@/components/location/DelhiServicePage';

export default function PaintingContractorsInDelhi() {
  return (
    <DelhiServicePage
      pageTitle="Painting Contractors in Delhi | Professional Painting Services | Home Glazer"
      metaDescription="Looking for trusted painting contractors in Delhi? HomeGlazer provides professional, reliable painting contractors with 35+ years experience, on-site supervisor & guaranteed quality."
      canonicalSlug="painting-contractors-in-delhi"
      breadcrumbLabel="Painting Contractors in Delhi"
      h1Title="Painting Contractors in Delhi"
      heroSubtitle="Hire Delhi's most experienced turn-key painting contractors for residential, commercial, and industrial painting projects. Written contracts and site supervision."
      heroImage="/uploads/hero-banner.webp"
      badgeLabel="CONTRACTOR EXPERTISE"
      aboutTitle="Professional Painting Contractors in Delhi NCR"
      aboutContent={[
        "Managing individual unorganized painters often leads to missed deadlines, poor surface prep, hidden material costs, and messy work sites. Hiring professional painting contractors like HomeGlazer eliminates these hassles entirely.",
        "HomeGlazer operates as a fully licensed, ISO-certified painting contracting firm in Delhi NCR with over 35 years of proven industry leadership. We provide end-to-end contract execution, dedicated site supervisors, trained painter teams, and standardized quality checklists.",
        "From small apartment repainting jobs to massive commercial complexes in Connaught Place, South Extension, Dwarka, Rohini, or Gurgaon, our painting contractors deliver flawless craftsmanship on schedule and within budget."
      ]}
      aboutImage="/uploads/team-pic.png"
      serviceFeaturesTitle="Our Contracting Services"
      serviceFeaturesSubtitle="Comprehensive painting contracting solutions tailored to your property requirements."
      serviceFeatures={[
        {
          title: "Residential Contracts",
          description: "Complete house, flat, and villa painting solutions with furniture masking, damp-proofing, and shade design.",
          imageUrl: "/uploads/actual-residential-painting.png",
          bulletPoints: [
            "Turnkey house painting",
            "On-site project supervisor",
            "100% branded genuine paints",
            "Clean post-paint handover"
          ]
        },
        {
          title: "Commercial Contracts",
          description: "Speedy execution for offices, showrooms, hotels, restaurants, and retail spaces with night/weekend shifts.",
          imageUrl: "/uploads/Commercial.png",
          bulletPoints: [
            "Office & retail store painting",
            "Flexible night/weekend shifts",
            "GST invoicing & formal BOQ",
            "Safety certified painter teams"
          ]
        },
        {
          title: "Wood & Metal Refinishing",
          description: "PU polish, Melamyne polishing, enamel painting for doors, windows, gates, and customized wooden fixtures.",
          imageUrl: "/uploads/services/wood-polish.jpg",
          bulletPoints: [
            "Teak door & window polish",
            "Melamyne & Italian PU polish",
            "Enamel gate & railing paint",
            "Fixed-cost written agreement"
          ]
        }
      ]}
      processTitle="How Our Contractors Work"
      processSubtitle="A structured turn-key workflow to deliver quality results without delay."
      processSteps={[
        {
          title: "Site Audit",
          desc: "Our senior contractor visits the site to record dimensions, wall flaws, and client expectations."
        },
        {
          title: "Formal Quotation",
          desc: "Issuing a clear written contract detailing material brands, layer counts, payment stages, and timeline."
        },
        {
          title: "Supervised Execution",
          desc: "Dedicated supervisor monitors daily painter attendance, surface sanding, and paint application coats."
        },
        {
          title: "Quality Sign-Off",
          desc: "Joint inspection with client, touch-ups, deep site cleaning, and official warranty certificate delivery."
        }
      ]}
      faqs={[
        {
          question: "Why should I choose HomeGlazer over local individual painters in Delhi?",
          answer: "HomeGlazer provides trained background-verified painters, dedicated site supervisors, 100% genuine branded paints, written contracts, clean execution, and post-project warranty support."
        },
        {
          question: "Do your painting contractors work on weekends or nights for offices in Delhi?",
          answer: "Yes, for commercial and office painting contracts in Delhi, we offer flexible work schedules including night shifts and weekends to ensure zero business downtime."
        },
        {
          question: "How do you calculate the contract price for painting in Delhi?",
          answer: "Contract pricing is based on total paintable area (measured via digital laser), wall condition, required putty/primer coats, chosen paint line, and specific finishes required."
        }
      ]}
    />
  );
}
