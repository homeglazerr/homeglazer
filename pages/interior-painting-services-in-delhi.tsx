import React from 'react';
import DelhiServicePage from '@/components/location/DelhiServicePage';

export default function InteriorPaintingServicesInDelhi() {
  return (
    <DelhiServicePage
      pageTitle="Interior Painting Services in Delhi | Living & Bedroom Painters | Home Glazer"
      metaDescription="Premium interior painting services in Delhi NCR. Transform living rooms, bedrooms & ceilings with dustless execution, washable paints & Asian Paints colour shade advice. Free estimate!"
      canonicalSlug="interior-painting-services-in-delhi"
      breadcrumbLabel="Interior Painting Services in Delhi"
      h1Title="Interior Painting Services in Delhi"
      heroSubtitle="Transform your living spaces with our professional interior painting services in Delhi NCR. From living rooms to bedrooms, we ensure perfect finishes."
      heroImage="/uploads/services/interior-painting-service.jpg"
      badgeLabel="HOME GLAZER INTERIORS"
      aboutTitle="Home Glazer Interior Painting Services in Delhi"
      aboutContent={[
        "Your home's interior reflects your personality, mood, and lifestyle. At HomeGlazer, we specialize in high-precision interior wall painting across Delhi, helping you select the perfect color palette and sheen levels for every room.",
        "From modern matte finishes that mask minor wall imperfections to rich luxury sheens that bounce soft light across living spaces, our trained interior painters use dust-less sanding machines and premium primers for ultra-smooth wall surfaces.",
        "We prioritize your safety and comfort by offering low-VOC, odorless, anti-bacterial interior paints from Asian Paints Royale, Berger Silk, and Nerolac Impressions, making them safe for kids and pets."
      ]}
      aboutImage="/uploads/bedroom6.jpg"
      serviceFeaturesTitle="Our Interior Painting Solutions"
      serviceFeaturesSubtitle="Comprehensive interior painting solutions designed to make your home interior vibrant and beautiful."
      serviceFeatures={[
        {
          title: "Living Room & Accent Wall",
          description: "Transform your main living spaces with designer accent walls, vibrant color contrasts, and washable luxury paints.",
          imageUrl: "/uploads/services/interior-painting-service.jpg",
          bulletPoints: [
            "Living room wall painting",
            "Designer feature walls",
            "Stain-resistant luxury paints",
            "Color shade consultations"
          ]
        },
        {
          title: "Bedroom & Kids Room",
          description: "Relaxing pastel palettes, eco-friendly zero-VOC paints, and creative theme designs for children's bedrooms.",
          imageUrl: "/uploads/bedroom6.jpg",
          bulletPoints: [
            "Bedroom color palettes",
            "Odorless & zero-VOC paints",
            "Kids room stencil artwork",
            "Smooth putty finish"
          ]
        },
        {
          title: "Ceilings & Trim Work",
          description: "Flawless white ceiling coats, cornices, mouldings, skirtings, and door frame precision painting.",
          imageUrl: "/uploads/actual-residential-painting.png",
          bulletPoints: [
            "White ceiling paint coats",
            "Cornice & moulding painting",
            "Door & window trim painting",
            "Cracks & gap sealing"
          ]
        }
      ]}
      processTitle="Our Interior Painting Process"
      processSubtitle="Steps we take to ensure your home stays clean, safe, and beautifully painted."
      processSteps={[
        {
          title: "Masking & Covering",
          desc: "We cover all furniture, sofas, TVs, floorings, and switchboards with drop cloths and masking tape."
        },
        {
          title: "Wall Prep & Putty",
          desc: "Filling cracks, repairing uneven surfaces with acrylic wall putty, and sanding smooth with dustless machines."
        },
        {
          title: "Paint Application",
          desc: "Applying interior wall primer followed by two coats of chosen premium emulsion using roller technique."
        },
        {
          title: "Site Clean-Up",
          desc: "Removing all protective tape, sweeping floors, placing furniture back, and final quality sign-off."
        }
      ]}
      faqs={[
        {
          question: "Which paint type is best for interior walls in Delhi homes?",
          answer: "Premium acrylic emulsions like Asian Paints Royale, Apcolite All Protek, or Berger Silk Glamor are ideal because they are washable, stain-resistant, and long-lasting."
        },
        {
          question: "Can I stay in my home while interior painting is taking place?",
          answer: "Yes! We use low-odor, zero-VOC interior paints, dust-less equipment, and paint room-by-room so your daily life in Delhi experiences minimal disruption."
        },
        {
          question: "What is the cost of interior painting per square foot in Delhi?",
          answer: "Interior painting cost in Delhi ranges from ₹12 to ₹38 per sq. ft. depending on whether it is a repainting job, putty requirement, and chosen paint category."
        }
      ]}
    />
  );
}
