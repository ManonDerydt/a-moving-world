import React from "react";
import { Separator } from "../../../../components/ui/separator";

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="w-full bg-[#252121] py-14 px-4">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center">
              <span className="font-['Poppins',Helvetica] font-bold text-white text-[28.5px]">
                Un Monde <br/>en Mouvement
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed lowercase">
             Un livre unique qui explore l'état et l'évolution de l'information en France à travers
              les regards croisés de personnalités médiatiques influentes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-['Poppins',Helvetica] font-bold text-white text-lg">
              Liens Rapides
            </h3>
            <ul className="space-y-2">
              <li className="text-white/80 hover:text-white cursor-pointer"
                  onClick={() => document.getElementById('home')?.scrollIntoView({behavior: 'smooth'})}>Accueil
              </li>
              <li className="text-white/80 hover:text-white cursor-pointer mt-5"
                  onClick={() => document.getElementById('concept')?.scrollIntoView({behavior: 'smooth'})}>Concept
              </li>
              <li className="text-white/80 hover:text-white cursor-pointer mt-5"
                  onClick={() => document.getElementById('personnalities')?.scrollIntoView({behavior: 'smooth'})}>Les
                personnalités
              </li>
              <li className="text-white/80 hover:text-white cursor-pointer mt-5"
                  onClick={() => document.getElementById('questions')?.scrollIntoView({behavior: 'smooth'})}>Les
                questions
              </li>
              <li className="text-white/80 hover:text-white cursor-pointer mt-5"
                  onClick={() => document.getElementById('waitlist')?.scrollIntoView({behavior: 'smooth'})}>Liste
                d'attente
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-['Poppins',Helvetica] font-bold text-white text-lg">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-white/80">Email: contact@mondenmouvement.fr</li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-16">
          <Separator className="bg-white/20"/>
          <div className="flex justify-center mt-4">
            <p className="text-white/80 text-sm">
              © 2025 Un Monde en Mouvement. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};