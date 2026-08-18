import React from 'react';
import DelhiServicePage from '@/components/location/DelhiServicePage';

export default function TexturePaintingServicesInDelhi() {
  return (
    <DelhiServicePage
      pageTitle="Texture Painting Services in Delhi | Designer Wall Textures | Home Glazer"
      metaDescription="Transform feature walls with texture painting services in Delhi. Asian Paints Royale Play, metallic textures, concrete effect, stencils & 3D designs by master wall artists."
      canonicalSlug="texture-painting-services-in-delhi"
      breadcrumbLabel="Texture Painting Services in Delhi"
      h1Title="Texture Painting Services in Delhi"
      heroSubtitle="Add grandeur and modern sophistication to your living room and bedroom walls with artistic wall textures, Royale Play finishes, metallic glazes, and custom stencils."
      heroImage="/uploads/services/texture-painting-service.jpg"
      badgeLabel="HOME GLAZER WALL DECOR"
      aboutTitle="Home Glazer Texture Painting Services in Delhi"
      aboutContent={[
        "A single textured wall can transform the entire ambience of your living room, bedroom, or entrance lobby. Texture painting goes beyond simple flat color, creating three-dimensional tactile patterns, metallic gleams, and artistic depth.",
        "HomeGlazer houses Delhi's finest certified texture applicators and wall artists experienced in Asian Paints Royale Play, Berger Silk Illusions, and Dulux Velvet Touch texture ranges.",
        "From rustic metallic glazes, Safari effects, Stucco marble finishes, to contemporary geometrical stencil work, we craft customized feature walls that become captivating conversation starters for your home."
      ]}
      aboutImage="/uploads/texture-painting.jpg"
      serviceFeaturesTitle="Our Texture Wall Offerings"
      serviceFeaturesSubtitle="Artistic wall textures and finishes engineered for stunning visual impact."
      serviceFeatures={[
        {
          title: "Royale Play Textures",
          description: "Classic Asian Paints Royale Play textures like Special Effects, Infinitex, Fizz, Weave, and Canvas.",
          imageUrl: "/uploads/services/texture-painting-service.jpg",
          bulletPoints: [
            "Asian Paints Royale Play designs",
            "Custom color glazes",
            "Long-lasting protective clear coat",
            "Washable & easy maintenance"
          ]
        },
        {
          title: "Stucco & Italian Marble",
          description: "Ultra-smooth high-gloss Venetian stucco wall finishes that mimic natural polished marble and stone.",
          imageUrl: "/uploads/texture-painting.jpg",
          bulletPoints: [
            "Venetian stucco finish",
            "Mirror-like gloss sheen",
            "Seamless stone appearance",
            "Ideal for drawing rooms"
          ]
        },
        {
          title: "Metallic & Stencil Art",
          description: "Gold, copper, and silver metallic glazes combined with damask or geometric precision stencils.",
          imageUrl: "/uploads/stencil-art.png",
          bulletPoints: [
            "Metallic topcoat sheen",
            "Precision stencil patterns",
            "Temple & bed backdrop accents",
            "Customized stencil themes"
          ]
        }
      ]}
      processTitle="Our Texture Painting Process"
      processSubtitle="Precision application steps for flawless textured feature walls."
      processSteps={[
        {
          title: "Wall Prep & Leveling",
          desc: "Creating an ultra-flat base coat with double putty and smooth primer to ensure sharp texture definition."
        },
        {
          title: "Basecoat Application",
          desc: "Applying two coats of rich background paint as the base color for the texture pattern."
        },
        {
          title: "Texture Crafting",
          desc: "Using specialized combs, trowels, rollers, sea sponges, or spatulas to shape the texture artwork."
        },
        {
          title: "Clear Coat Seal",
          desc: "Applying a washable clear protective glaze to preserve sheen and facilitate easy wall cleaning."
        }
      ]}
      faqs={[
        {
          question: "What is the cost of texture painting per sq ft in Delhi?",
          answer: "Texture painting in Delhi ranges from ₹45 to ₹150 per sq. ft., depending on the chosen texture design, metallic glaze, and brand range (Royale Play, Stucco, etc.)."
        },
        {
          question: "Can texture paint be cleaned easily?",
          answer: "Yes! Most premium texture paints from Asian Paints or Berger are sealed with a protective clear coat, making them washable with a damp microfiber cloth."
        },
        {
          question: "How long does it take to complete one texture feature wall?",
          answer: "A standard 10x12 ft feature wall takes approximately 1 to 2 days including basecoat drying and detailed texture crafting."
        }
      ]}
    />
  );
}
