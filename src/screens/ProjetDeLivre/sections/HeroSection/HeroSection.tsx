import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { AuthModal } from "../../../../components/AuthModal";
import { auth, db } from "../../../../lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Menu, X } from "lucide-react";
import {useFirebaseData} from "../../../../lib/hooks/useFirebaseData.ts";
import {GlobalAssets} from "../../../../lib/types.ts"; // Icônes pour le menu burger


export const HeroSection = (): JSX.Element => {
  const { assets } = useFirebaseData();

  console.log("Les assets :", assets)
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // État pour le menu burger

  const handleScroll = (id: string) => {
    setMenuOpen(false); // Ferme le menu mobile
    setTimeout(() => scrollToSection(id), 300); // Ajoute un délai pour éviter tout conflit
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth", // Permet un défilement fluide
        block: "start", // Positionner en haut de la section
      });
    }
  };

// Usage dans l'élément li
  <li className="cursor-pointer hover:text-[#242565]" onClick={() => scrollToSection("concept")}>Concept</li>


  useEffect(() => {
    const fetchUserData = async (currentUser: any) => {
      if (!currentUser) {
        setUser(null);
        setFirstName(null);
        return;
      }

      setUser(currentUser);
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFirstName(userData.firstName || "Utilisateur");
        } else {
          setFirstName("Utilisateur");
        }
      } catch (error) {
        setFirstName("Utilisateur");
      }
    };

    const unsubscribe = auth.onAuthStateChanged(fetchUserData);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setFirstName(null);
  };

  return (
      <section id="home" className="relative w-full h-[500px] sm:h-[500px] md:h-[750px] flex flex-col bg-gradient-to-r from-[#7771d8] to-[#5a9bb5] text-center border-bottom-2">
        <div className="absolute inset-0 opacity-90"/>


        {/* HEADER */}
        <div
            className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 w-full border-b border-white">
          {/* Logo */}
          <div className="flex items-center">
            {assets.map((asset) => (
                <img
                    src={asset.logoUrl}
                    alt="logo"
                    className="w-14 h-14 bg-contain mr-5"
                />
            ))}
            <h1 className="font-bold text-white text-lg md:text-xl">Un Monde en Mouvement</h1>
          </div>

          {/* MENU BURGER (Mobile) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
              {menuOpen ? <X size={32}/> : <Menu size={32}/>}
            </button>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex justify-center text-center">
            <ul className="flex space-x-6 text-white font-semibold">
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('home')?.scrollIntoView({behavior: 'smooth'})}>Accueil
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('concept')?.scrollIntoView({behavior: 'smooth'})}>Concept
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('personnalities')?.scrollIntoView({behavior: 'smooth'})}>Les
                personnalités
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('questions')?.scrollIntoView({behavior: 'smooth'})}>Les
                questions
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('waitlist')?.scrollIntoView({behavior: 'smooth'})}>Liste
                d'attente
              </li>
            </ul>
          </nav>

          {/* Bouton Connexion/Inscription */}
          <div className="hidden md:block">
            {user ? (
                <Button onClick={handleLogout}
                        className="bg-[#242565] hover:bg-red-600 text-white rounded-full px-6 py-2">
                  Déconnexion
                </Button>
            ) : (
                <Button onClick={() => setShowAuthModal(true)}
                        className="hover:bg-white hover:text-[#242565] text-white rounded-full px-6 py-2">
                  Je m'inscris
                </Button>
            )}
          </div>
        </div>

        {/* MENU BURGER (Mobile) */}
        {menuOpen && (
            <nav
                className="fixed md:hidden absolute top-[70px] left-0 w-full bg-gradient-to-r from-[#7771d8] to-[#5a9bb5] text-white flex flex-col items-center py-4 z-20 border-b border-white">
              <ul className="space-y-4 text-lg">
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('home')?.scrollIntoView({behavior: 'smooth'})}>Accueil
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('concept')?.scrollIntoView({behavior: 'smooth'})}>Concept
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('personnalities')?.scrollIntoView({behavior: 'smooth'})}>Les
                  personnalités
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('questions')?.scrollIntoView({behavior: 'smooth'})}>Les
                  questions
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('waitlist')?.scrollIntoView({behavior: 'smooth'})}>Liste
                  d'attente
                </li>
              </ul>

              <div className="mt-4">
                {user ? (
                    <Button onClick={handleLogout}
                            className="bg-[#ff4d4d] hover:bg-red-600 text-white rounded-full px-6 py-2">
                      Déconnexion
                    </Button>
                ) : (
                    <Button onClick={() => {
                      setShowAuthModal(true);
                      setMenuOpen(false);
                    }} className="hover:bg-white hover:text-[#242565] text-white rounded-full px-6 py-2">
                      Je m'inscris
                    </Button>
                )}
              </div>
            </nav>
        )}

        {/* CONTENU PRINCIPAL */}
        <div
            className="mt-10 relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 max-w-[1300px] mx-auto">
          {/* Texte à gauche */}
          <div className="text-center md:w-1/3 relative">
            <h2 className="font-bold text-white text-4xl md:text-5xl tracking-wider leading-relaxed relative">
              <span className="relative inline-block mt-4">30</span><br/>
              personnalités
            </h2>
          </div>


          {/* Image du livre avec taille ajustée en mobile */}
          {assets.map((asset) => (
              <img
                  src={asset.bookImageUrl}
                  alt="Livre Un Monde en Mouvement"
                  className="mt-0 md:mt-16 relative w-[280px] sm:w-[350px] md:w-[500px] h-auto object-cover"
              />
          ))}

          {/* Texte à droite */}
          <div className="text-center md:w-1/3 relative hidden sm:block">
            <h2 className="font-bold text-white text-4xl md:text-5xl tracking-wider leading-relaxed relative inline-block">
              5 <br/>
              <span className="relative inline-block">questions</span>
            </h2>
          </div>
        </div>

        {/* Note pour l'image */}
        <div className="text-black text-sm mt-4">*L'image est à titre d'exemple.</div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}
                   onSuccess={() => setShowAuthModal(false)} mode="vote"/>
      </section>

      /*<section id="home" className="relative w-full h-[750px] flex flex-col bg-gradient-to-r from-[#7771d8] to-[#5a9bb5] text-center border-bottom-2">
        <div className="absolute inset-0 opacity-90" />

        {/!* HEADER *!/}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 w-full border-b border-white">
          {/!* Logo *!/}
          <div className="flex items-center">
            <img className="w-8 h-8 md:w-12 md:h-12 mr-3" alt="Logo" src="./public/logo-blue.png" />
            <h1 className="font-bold text-white text-lg md:text-xl">Un Monde en Mouvement</h1>
          </div>

          {/!* MENU BURGER (Mobile) *!/}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
              {menuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>

          {/!* Navigation (Desktop) *!/}
          <nav className="hidden md:flex justify-center text-center">
            <ul className="flex space-x-6 text-white font-semibold">
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('home')?.scrollIntoView({behavior: 'smooth'})}>Accueil
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('concept')?.scrollIntoView({behavior: 'smooth'})}>Concept
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('personnalities')?.scrollIntoView({behavior: 'smooth'})}>Les
                personnalités
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('questions')?.scrollIntoView({behavior: 'smooth'})}>Les
                questions
              </li>
              <li className="cursor-pointer hover:text-[#242565]"
                  onClick={() => document.getElementById('waitlist')?.scrollIntoView({behavior: 'smooth'})}>Liste
                d'attente
              </li>
            </ul>
          </nav>

          {/!* Bouton Connexion/Inscription *!/}
          <div className="hidden md:block">
            {user ? (
                <Button onClick={handleLogout} className="bg-[#242565] hover:bg-red-600 text-white rounded-full px-6 py-2">
                  Déconnexion
                </Button>
            ) : (
                <Button onClick={() => setShowAuthModal(true)} className="hover:bg-white hover:text-[#242565] text-white rounded-full px-6 py-2">
                  Je m'inscris
                </Button>
            )}
          </div>
        </div>

        {/!* MENU BURGER (Mobile) *!/}
        {menuOpen && (
            <nav className="fixed md:hidden absolute top-[70px] left-0 w-full bg-gradient-to-r from-[#7771d8] to-[#5a9bb5] text-white flex flex-col items-center py-4 z-20 border-b border-white">
              <ul className="space-y-4 text-lg">
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('home')?.scrollIntoView({behavior: 'smooth'})}>Accueil
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('concept')?.scrollIntoView({behavior: 'smooth'})}>Concept
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('personnalities')?.scrollIntoView({behavior: 'smooth'})}>Les
                  personnalités
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('questions')?.scrollIntoView({behavior: 'smooth'})}>Les
                  questions
                </li>
                <li className="cursor-pointer hover:text-[#242565]"
                    onClick={() => document.getElementById('waitlist')?.scrollIntoView({behavior: 'smooth'})}>Liste
                  d'attente
                </li>
              </ul>

              <div className="mt-4">
                {user ? (
                    <Button onClick={handleLogout}
                            className="bg-[#ff4d4d] hover:bg-red-600 text-white rounded-full px-6 py-2">
                      Déconnexion
                    </Button>
                ) : (
                    <Button onClick={() => {
                      setShowAuthModal(true);
                      setMenuOpen(false);
                    }} className="hover:bg-white hover:text-[#242565] text-white rounded-full px-6 py-2">
                      Je m'inscris
                    </Button>
                )}
              </div>
            </nav>
        )}

        {/!* CONTENU PRINCIPAL *!/}
        <div
            className="mt-10 relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 max-w-[1300px] mx-auto">
          {/!* Texte à gauche *!/}
          <div className="text-center md:w-1/3 relative">
            <h2 className="font-bold text-white text-4xl md:text-5xl tracking-wider leading-relaxed relative">
              <span className="relative inline-block mt-4">30</span>
              personnalités
            </h2>
          </div>

          {/!* Image du livre *!/}
          <img className="mt-16 relative w-[450px] h-auto object-cover" alt="Livre Un Monde en Mouvement" src="../public/book-1.png" />

          {/!* Texte à droite *!/}
          <div className="text-center md:w-1/3 relative">
            <h2 className="font-bold text-white text-4xl md:text-5xl tracking-wider leading-relaxed relative inline-block">
              5 <br />
              <span className="relative inline-block">questions</span>
            </h2>
          </div>
        </div>

        {/!* Note pour l'image *!/}
        <div className="text-white text-sm mt-4">*L'image est à titre d'exemple.</div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} mode="vote" />
      </section>*/
  );
};
