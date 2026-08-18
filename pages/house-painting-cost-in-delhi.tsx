import React from 'react';
import DelhiServicePage from '@/components/location/DelhiServicePage';

export default function HousePaintingCostInDelhi() {
  return (
    <DelhiServicePage
      pageTitle="House Painting Cost in Delhi | 1 BHK Painting Price in Delhi | Home Glazer"
      metaDescription="Check house painting cost in Delhi NCR per sq ft. Get accurate 1 BHK painting price in Delhi, 1 BHK house painting cost, 1 BHK painting charges in Delhi & free site estimate!"
      canonicalSlug="house-painting-cost-in-delhi"
      breadcrumbLabel="House Painting Cost in Delhi"
      h1Title="House Painting Cost in Delhi"
      heroSubtitle="Transparent per square foot rate guide, material breakdown, and price packages for 1 BHK, 2 BHK, and 3 BHK house painting in Delhi NCR."
      heroImage="/uploads/hero-banner.webp"
      badgeLabel="COST & PRICING GUIDE"
      aboutTitle="Understanding House Painting Costs in Delhi"
      aboutContent={[
        "Are you planning to paint your home in Delhi and wondering how much it will cost? Painting costs depend primarily on three factors: whether it is Fresh Painting (with wall putty) or Repainting, the quality level of paint selected (Distemper, Economy, Premium, or Luxury), and total paintable carpet area.",
        "When calculating the average 1 BHK house painting cost, several factors come into play including total wall area, surface condition, and paint brand selection. The starting 1 BHK painting price in Delhi ranges from ₹6,000 to ₹9,000 for basic distemper repainting, going up to ₹18,000 for premium washable emulsions.",
        "If you are looking for an affordable 1 BHK repainting cost in Delhi for rental property handovers or tenant moves, our entry-level packages offer quick 2-day turnaround times. Meanwhile, for a complete makeover, the 1 BHK interior painting cost ranges from ₹12,000 to ₹22,000 including double putty sanding and high-sheen Asian Paints or Berger products.",
        "Our all-inclusive 1 BHK painting charges in Delhi cover all material procurement, furniture masking, crack filling, and deep post-painting cleanup. For homeowners estimating their overall 1 BHK home painting cost, HomeGlazer offers free laser measurement site visits across Delhi NCR."
      ]}
      aboutImage="/uploads/budegt-calculator.png"
      costTiersTitle="House Painting Rate Packages in Delhi"
      costTiers={[
        {
          type: "Basic Fresh / Rental Paint",
          priceRange: "₹8 - ₹11 / sq. ft.",
          description: "Budget-friendly option ideal for rental property handover or quick touch-ups.",
          bestFor: "Tenants & Rental Flats",
          features: [
            "Asian Paints Tractor Distemper / Berger Bison",
            "Basic wall patching & spot putty",
            "1 Coat Primer + 2 Coats Paint",
            "1 BHK repainting cost in Delhi: ₹6,000 - ₹9,000"
          ]
        },
        {
          type: "Standard Premium Interior",
          priceRange: "₹14 - ₹22 / sq. ft.",
          description: "Durable washable paints with smooth matte or soft sheen finish for families.",
          bestFor: "Standard 1BHK, 2BHK & 3BHK Homes",
          features: [
            "Asian Paints Apcolite / Berger Silk",
            "Full Wall Putty + Primer",
            "Rich Sheen & Stain Resistance",
            "1 BHK interior painting cost: ₹12,000 - ₹18,000"
          ]
        },
        {
          type: "Luxury Royale Sheen Paint",
          priceRange: "₹25 - ₹45 / sq. ft.",
          description: "Ultra-premium stain-resistant Teflon coated paints with rich high sheen.",
          bestFor: "Luxury Flats & Villas",
          features: [
            "Asian Paints Royale Luxury / Berger Silk Glamor",
            "Double Putty + Micro-sanding",
            "Anti-bacterial & washable walls",
            "3-Year Written Warranty"
          ]
        }
      ]}
      serviceFeaturesTitle="Key Cost Drivers"
      serviceFeaturesSubtitle="Understanding the elements that determine your total painting estimate."
      serviceFeatures={[
        {
          title: "Fresh vs Repainting",
          description: "Fresh walls require 2 full coats of acrylic wall putty and primer before paint application, making fresh painting ~40% higher in cost than repainting.",
          imageUrl: "/uploads/actual-residential-painting.png"
        },
        {
          title: "Paint Quality & Sheen",
          description: "Choice between entry distemper, standard washable emulsion, or ultra-luxury Teflon coated Royale paints directly impacts material cost.",
          imageUrl: "/uploads/services/interior-painting-service.jpg"
        },
        {
          title: "Wall Condition & Prep",
          description: "Walls damaged by dampness, peeling paint, or major masonry cracks require specialized waterproofing primers and elastomeric repair.",
          imageUrl: "/uploads/scope-of-work.png"
        }
      ]}
      processTitle="How to Get an Exact Quote"
      processSubtitle="Easy steps to get an accurate, no-obligation estimate for your home."
      processSteps={[
        {
          title: "Book Visit",
          desc: "Contact HomeGlazer via Call or WhatsApp to request an on-site visit anywhere in Delhi NCR."
        },
        {
          title: "Laser Measurement",
          desc: "Our expert measures accurate carpet area and paintable wall/ceiling dimensions to determine your 1 BHK home painting cost."
        },
        {
          title: "Material Choice",
          desc: "Choose paint brands (Asian Paints, Berger, Nerolac) and finish types according to your budget."
        },
        {
          title: "Written Estimate",
          desc: "Get an all-inclusive estimate detailing square-foot rates, 1 BHK painting charges in Delhi, and execution timeline."
        }
      ]}
      faqs={[
        {
          question: "What is the average 1 BHK painting price in Delhi?",
          answer: "The 1 BHK painting price in Delhi typically ranges between ₹6,000 to ₹12,000 for repainting and ₹14,000 to ₹22,000 for fresh painting including surface putty preparation and premium emulsions."
        },
        {
          question: "What is the 1 BHK repainting cost in Delhi for rental flats?",
          answer: "For rental flats in Delhi, a quick distemper or tractor emulsion repainting job costs between ₹6,000 to ₹9,000 with a 2-day execution timeline."
        },
        {
          question: "What elements are included in 1 BHK painting charges in Delhi?",
          answer: "HomeGlazer's 1 BHK painting charges in Delhi include wall crack repair, primer coats, 2 coats of paint, furniture masking, floor protection, labor, and post-painting cleanup."
        },
        {
          question: "What is the painting cost for a 2BHK flat in Delhi?",
          answer: "The approximate painting cost for a 2BHK flat (carpet area 800-1000 sq ft) in Delhi ranges between ₹12,000 to ₹25,000 for repainting and ₹24,000 to ₹45,000 for fresh luxury painting."
        }
      ]}
    />
  );
}
