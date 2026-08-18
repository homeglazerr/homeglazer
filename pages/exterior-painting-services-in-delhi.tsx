import React from 'react';
import DelhiServicePage from '@/components/location/DelhiServicePage';

export default function ExteriorPaintingServicesInDelhi() {
  return (
    <DelhiServicePage
      pageTitle="Exterior Painting Services in Delhi | Weatherproof House Painters | Home Glazer"
      metaDescription="Professional exterior painting services in Delhi NCR. Protect & beautify building facades, villas & apartments with weather-proof, anti-fungal & crack-bridging exterior paints."
      canonicalSlug="exterior-painting-services-in-delhi"
      breadcrumbLabel="Exterior Painting Services in Delhi"
      h1Title="Exterior Painting Services in Delhi"
      heroSubtitle="Protect and beautify your home's exterior with our weather-resistant painting solutions and professional techniques in Delhi NCR."
      heroImage="/uploads/exterior-painting.png"
      badgeLabel="HOME GLAZER EXTERIORS"
      aboutTitle="Home Glazer Exterior Painting Services in Delhi"
      aboutContent={[
        "Delhi's environment presents severe challenges for exterior building surfaces—from soaring summer temperatures exceeding 45°C to heavy monsoon rains and high smog levels. Standard exterior paints peel, crack, or fade rapidly without proper protection.",
        "HomeGlazer offers high-performance exterior painting services engineered to withstand harsh weather conditions. We utilize advanced elastomeric exterior coatings, silicon-based water repellents, and anti-fungal paint systems from Asian Paints Apex Ultima, Berger WeatherCoat, and Nerolac Excel.",
        "Our safety-certified painters utilize sturdy scaffolding, safety harnesses, power washing machines, and crack-sealing techniques to ensure complete elevation coverage for independent houses, villas, and multi-storey apartments across Delhi."
      ]}
      aboutImage="/uploads/residential.png"
      serviceFeaturesTitle="Our Exterior Painting Solutions"
      serviceFeaturesSubtitle="Comprehensive exterior wall treatment and painting options to protect your building."
      serviceFeatures={[
        {
          title: "House Exterior Elevation",
          description: "Protecting outer walls against rain, dust, and UV radiation with high-durability acrylic exterior paints.",
          imageUrl: "/uploads/exterior-painting.png",
          bulletPoints: [
            "House exterior elevation painting",
            "Weather-resistant acrylic coatings",
            "Anti-fungal & anti-algae protection",
            "Long-lasting sheen & color fastness"
          ]
        },
        {
          title: "Pressure Washing & Prep",
          description: "Deep cleaning outer walls using high-pressure jet washers to remove mold, dirt, and loose paint.",
          imageUrl: "/uploads/residential.png",
          bulletPoints: [
            "High-pressure water jet cleaning",
            "Efflorescence & salt treatment",
            "Surface sanding & scraping",
            "Masonry crack filling"
          ]
        },
        {
          title: "Elastomeric Crack Shield",
          description: "Specialized flexible paint coatings that stretch over structural micro-cracks to prevent water ingress.",
          imageUrl: "/uploads/services/residential-painting.jpg",
          bulletPoints: [
            "Elastomeric crack bridging",
            "Damp-proof exterior primer",
            "Waterproofing topcoats",
            "Multi-year written warranty"
          ]
        }
      ]}
      processTitle="Our Exterior Painting Process"
      processSubtitle="Systematic preparation and application steps for long-lasting exterior protection."
      processSteps={[
        {
          title: "Pressure Washing",
          desc: "Deep cleaning outer walls using high-pressure jet washers to remove dirt and algae."
        },
        {
          title: "Crack Sealing",
          desc: "Filling plaster cracks with waterproof acrylic sealants and repairing damaged masonry."
        },
        {
          title: "Exterior Primer",
          desc: "Applying heavy-duty exterior primer for deep substrate adhesion and moisture protection."
        },
        {
          title: "Dual Topcoat Paint",
          desc: "Applying two coats of weather-shield acrylic exterior emulsion for long-lasting color sheen."
        }
      ]}
      faqs={[
        {
          question: "How long does exterior paint last in Delhi weather?",
          answer: "Premium exterior paints like Asian Paints Apex Ultima or Berger WeatherCoat All Guard last 7 to 10 years when applied over properly prepared surfaces in Delhi."
        },
        {
          question: "Which season is best for exterior painting in Delhi?",
          answer: "October to April (Autumn through Spring) is the ideal time for exterior painting in Delhi due to low humidity, comfortable temperatures, and absence of rain."
        },
        {
          question: "What is the exterior painting cost per sq ft in Delhi?",
          answer: "Exterior house painting in Delhi ranges from ₹14 to ₹40 per sq. ft., depending on building height, surface prep, scaffolding requirements, and paint warranty level."
        }
      ]}
    />
  );
}
