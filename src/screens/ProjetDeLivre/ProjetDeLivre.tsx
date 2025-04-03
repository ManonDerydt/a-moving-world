import React from "react";
import { BrandSection } from "./sections/BrandSection/BrandSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { PersonalitiesSection } from "./sections/PersonalitiesSection";
import { QuestionsSection } from "./sections/QuestionsSection/QuestionsSection";
import { SearchSection } from "./sections/SearchSection/SearchSection";
import { WaitlistSection } from "./sections/WaitlistSection/WaitlistSection";
import {CookieBanner} from "./sections/CookieSection/CookieBanner";
import { useNavigate } from "react-router-dom";

export const ProjetDeLivre = (): JSX.Element => {
  return (
    <section className="w-full min-h-screen bg-white">
      <div className="w-full" >
        {/* Hero Section - Full width */}
        <HeroSection />

        <section id="concept" className="mt-16">
          <div className="w-full bg-gradient-to-b from-[#f8f9ff] to-white">
            <div className="w-full max-w-[900px] mx-auto px-4 py-24">
              <h2 className="text-3xl md:text-4xl font-bold text-[#242565] mb-4 font-['Poppins',Helvetica] text-center mt-20">Le Concept</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-center md:text-[22px]">
                Nous créons un livre unique qui explore l'état et l'évolution de l'information en France.
                À travers les regards croisés de 30 personnalités médiatiques influentes, nous aborderons
                les enjeux majeurs du paysage médiatique actuel. Votez pour les personnalités que vous
                souhaitez voir participer à ce projet innovant.
              </p>
            </div>

            {/* Search Section */}
            <SearchSection/>
          </div>
        </section>

        {/* Concept Section - Below Hero */}


        {/* Personalities Section */}
        <PersonalitiesSection/>

        {/* Questions Section - Full width */}
        <QuestionsSection/>

        {/* Waitlist Section - Full width */}
        <WaitlistSection/>

        {/* Brand Section */}
        <BrandSection/>

        {/* Footer Section - Full width */}
        <FooterSection/>

        {/* Bannière de cookies */}
        <CookieBanner/>
      </div>
    </section>
  );
};