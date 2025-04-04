import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { motion } from "framer-motion";
import { Card } from "../../../../components/ui/card";
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useAuth } from "../../../../lib/hooks/useAuth";
import {useFirebaseData} from "../../../../lib/hooks/useFirebaseData.ts";

export const WaitlistSection = (): JSX.Element => {
  const { assets } = useFirebaseData();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("test")
    const checkExistingSubmission = async () => {
      if (!user?.email) return;

      console.log("User email: ", user.email); // Vérifie si l'email de l'utilisateur est correctement récupéré


      const waitlistRef = collection(db, 'waitlist');
      const q = query(waitlistRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSubmitted(true);
        setError("Vous êtes déjà inscrit sur la liste d'attente");
      }
    };

    checkExistingSubmission();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const waitlistRef = collection(db, 'waitlist');
      const q = query(waitlistRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Vous êtes déjà inscrit sur la liste d'attente");
        return;
      }

      await addDoc(waitlistRef, {
        email,
        fullName: name,
        createdAt: new Date()
      });

      setSubmitted(true);
      setEmail("");
      setName("");
    } catch (err) {
      console.error('Error adding to waitlist:', err);
      setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="relative w-full py-32 overflow-hidden mt-10 mb-10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br bg-blue-500 opacity-5" />
          {/*from-[#ed4690] to-[#5522cc]*/}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#242565] mb-2">
                Merci de votre inscription !
              </h3>
              <p className="text-gray-600">
                Nous vous tiendrons informé des prochaines étapes du projet.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
      <section id="waitlist" className="relative w-full pt-20 pb-20 overflow-hidden bg-[#3582ab] border-t-2 border-[#252121]">
        {/* Effets de fond */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5"/>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"/>
        </div>

        <div className="relative container mx-auto px-6 lg:px-12">
          <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              className="text-center"
          ></motion.div>

          {/* Contenu principal */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 ">
            {/* Image du livre */}
            <div className="w-full md:w-2/5 flex justify-center">
              {assets.map((asset) => (
                  <img
                      src={asset.bookImageUrl}
                      alt="Livre Un Monde en Mouvement"
                      className="w-[300px] md:w-[320px]"
                  />
              ))}
            </div>

            {/* Formulaire d'inscription */}
            <Card className="relative rounded-2xl p-10 w-full max-w-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Poppins',Helvetica]">
                    Rejoignez la Liste d'Attente
                  </h2>
                  <p className="text-lg text-white font-['DM_Sans',Helvetica]">
                    Soyez parmi les premiers à découvrir ce projet unique et à participer à son évolution.
                  </p>

                  <div className="space-y-2">
                    {/*<Label htmlFor="name" className="text-gray-700 font-medium">
                      Nom complet
                    </Label>*/}
                    {/*<Input*/}
                    {/*    id="name"*/}
                    {/*    type="text"*/}
                    {/*    value={name}*/}
                    {/*    onChange={(e) => setName(e.target.value)}*/}
                    {/*    placeholder="Votre nom"*/}
                    {/*    className="h-12 w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"*/}
                    {/*    required*/}
                    {/*    disabled={loading}*/}
                    {/*/>*/}
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:flex w-full max-w-lg rounded-full overflow-hidden">
                    <input
                        type="email"
                        placeholder="Votre adresse email"
                        className="flex-1 px-4 py-4 text-gray-600 outline-none bg-white border-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        className="bg-[#252121] text-white px-6 py-4 font-bold h-full"
                        disabled={loading}
                    >
                      {loading ? "Envoi..." : "Rejoindre la liste d'attente"}
                    </Button>
                  </div>

                  {/* Mobile */}
                  <div className="flex flex-col sm:hidden w-full max-w-lg space-y-4">
                    <input
                        type="email"
                        placeholder="Votre adresse email"
                        className="px-4 py-4 text-gray-600 outline-none bg-white border-none rounded-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        className="bg-[#252121] text-white px-6 py-4 font-bold h-full rounded-full"
                        disabled={loading}
                    >
                      {loading ? "Envoi..." : "Rejoindre la liste d'attente"}
                    </Button>
                  </div>





                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Bouton d'inscription d'origine */}

                {/*<Button*/}
                {/*    type="submit"*/}
                {/*    className="w-full h-[60px] bg-[#242565] hover:bg-[#1790f5] rounded-[50px] font-['DM_Sans',Helvetica] font-bold text-[17px]"*/}
                {/*    disabled={loading}*/}
                {/*>*/}
                {/*  {loading ? "Inscription en cours..." : "Rejoindre la liste d'attente"}*/}
                {/*</Button>*/}
              </form>

              {/*<p className="text-white text-xs mt-4 text-center">*/}
              {/*  Vos informations sont protégées et nous ne faisons pas de spam. Consultez notre{" "}*/}
              {/*  <a href="#" className="text-blue-600 underline">politique de confidentialité</a>.*/}
              {/*</p>*/}
            </Card>
          </div>
        </div>
      </section>


  );
};