import React from 'react';
import DelhiServicePage from '@/components/location/DelhiServicePage';

export default function WoodPolishingServicesInDelhi() {
  return (
    <DelhiServicePage
      pageTitle="Wood Polishing Services in Delhi | Professional Wood Restoration | Home Glazer"
      metaDescription="Expert wood polishing services in Delhi NCR. PU Polish, Melamyne finish, French polish, teak wood polishing for doors, windows, dining tables & furniture. Free quote!"
      canonicalSlug="wood-polishing-services-in-delhi"
      breadcrumbLabel="Wood Polishing Services in Delhi"
      h1Title="Wood Polishing Services in Delhi"
      heroSubtitle="Restore, protect, and highlight the natural wood grain of your doors, windows, staircases, and wooden furniture with Delhi's top PU polish & wood coating specialists."
      heroImage="/uploads/services/wood-polish.jpg"
      badgeLabel="HOME GLAZER WOOD CARE"
      aboutTitle="Home Glazer Wood Polishing Services in Delhi"
      aboutContent={[
        "Wooden doors, timber furniture, wall paneling, and teakwood fixtures add timeless luxury to any home. However, exposure to sunlight, humidity, dust, and handling causes wood polish to dull, scratch, or darken over time.",
        "HomeGlazer delivers specialized wood polishing and wood coating services across Delhi. Our master polishers are trained in high-grade polyurethane (PU) polish, Melamyne polishing, polyester coatings, and traditional French polish (Lakh Polish).",
        "We handle everything from sanding down old cracked varnish, filling wood pores, applying stain tints (Teak, Walnut, Rosewood, Mahogany), to applying crystal-clear topcoats in Matte, Gloss, or High-Gloss Sheen."
      ]}
      aboutImage="/uploads/services/Home Glazer at Wood Polishing.png"
      serviceFeaturesTitle="Our Wood Polishing Offerings"
      serviceFeaturesSubtitle="Tailored wood care, polishing, and restoration finishes."
      serviceFeatures={[
        {
          title: "PU (Polyurethane) Polish",
          description: "Ultra-durable, scratch-resistant, UV-proof, and water-repellent wood coating available in Gloss and Silky Matte finish.",
          imageUrl: "/uploads/services/wood-polish.jpg",
          bulletPoints: [
            "Italian PU & Asian Paints Emporio",
            "Gloss, Semi-Gloss, or Matte sheen",
            "Scratch & heat resistant",
            "Long 8-12 year durability"
          ]
        },
        {
          title: "Melamyne Polish Finish",
          description: "Popular heat-resistant and moisture-protective polish ideal for interior wooden doors, wardrobes, and cabinets.",
          imageUrl: "/uploads/wood-polishing.png",
          bulletPoints: [
            "Melamyne sealers & topcoats",
            "Heat & spill resistance",
            "Ideal for indoor furniture",
            "Cost-effective solution"
          ]
        },
        {
          title: "Teak & Door Restoration",
          description: "Complete sanding, stain tinting, and polishing for main entrance doors, window frames, and dining tables.",
          imageUrl: "/uploads/services/A%20Legacy%20of%20Excellence.png",
          bulletPoints: [
            "Deep sanding down to raw wood",
            "Teak & Walnut stain matching",
            "Clear natural grain highlights",
            "On-site clean execution"
          ]
        }
      ]}
      processTitle="Our Wood Polishing Process"
      processSubtitle="Five-stage process to bring out the natural grain and luster of your wooden assets."
      processSteps={[
        {
          title: "Emery Sanding",
          desc: "Sanding the wood surface with varying grit emery papers to remove old dull varnish."
        },
        {
          title: "Pore Sealing",
          desc: "Applying matching shade wood filler to seal natural pores, nail holes, and minor wood cracks."
        },
        {
          title: "Stain Tinting",
          desc: "Applying rich wood stain tints (Teak, Walnut, Rosewood) to achieve the desired wood tone."
        },
        {
          title: "PU / Melamyne Topcoat",
          desc: "Applying multiple coats of sealer and topcoat polish followed by fine hand-rubbing."
        }
      ]}
      faqs={[
        {
          question: "Which polish is better for main doors: PU Polish or Melamyne Polish?",
          answer: "PU (Polyurethane) Polish is significantly better for main doors in Delhi because it offers superior UV resistance, weather-proofing, scratch resistance, and double the lifespan of Melamyne polish."
        },
        {
          question: "What is the wood polishing cost per sq ft in Delhi?",
          answer: "Wood polishing cost in Delhi ranges from ₹35 to ₹75/sq ft for Melamyne polish and ₹90 to ₹220/sq ft for Italian PU polish, depending on wood condition and finish sheen."
        },
        {
          question: "How long does PU polish last on wooden doors in Delhi?",
          answer: "High-quality PU polish from Asian Paints Emporio or ICA lasts 8 to 12 years without losing its clarity or yellowing."
        }
      ]}
    />
  );
}
