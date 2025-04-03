import React, { useState, useEffect } from "react";
import { Card } from "../../../../components/ui/card";
import { motion } from "framer-motion";
import { useFirebaseData } from "../../../../lib/hooks/useFirebaseData";
import { useAuth } from "../../../../lib/hooks/useAuth";
import { useVotes } from "../../../../lib/hooks/useVotes";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Heart, ArrowLeft } from "lucide-react";
import { cn } from "../../../../lib/utils";

export const PersonalitiesSection = (): JSX.Element => {
  const { personalities, loading } = useFirebaseData();
  const { user } = useAuth();
  const { addVote, removeVote, checkExistingVote } = useVotes();


  const [selectedVotes, setSelectedVotes] = useState<Set<string>>(new Set());
  const [confirmedVotes, setConfirmedVotes] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filter, setFilter] = useState("Tous");

  const MAX_VOTES_PER_USER = 3;
  const [voteLimitReached, setVoteLimitReached] = useState(false);
  const [currentPersonalityId, setCurrentPersonalityId] = useState<string | null>(null);

  const [visiblePreselectedCount, setVisiblePreselectedCount] = useState(3);
  const [visibleVotingCount, setVisibleVotingCount] = useState(6);

  const topVotedPersonalities = [...personalities]
      .sort((a, b) => b.votesCount - a.votesCount)
      .slice(0, 3);

  useEffect(() => {
    if (!user || personalities.length === 0) return;

    const fetchVotes = async () => {
      const userVoted = new Set<string>();
      for (const personality of personalities) {
        const hasVoted = await checkExistingVote("personality", personality.id, user.uid);
        if (hasVoted) {
          userVoted.add(personality.id);
        }
      }
      setSelectedVotes(userVoted);
      setConfirmedVotes(Array.from(userVoted));
    };

    fetchVotes();
  }, [user, personalities]);

  const filteredPersonalities = personalities.filter((p) =>
      filter === "Tous" ? true : p.category === filter
  );

  const filteredPersonalitiesToVote = personalities.filter((p) =>
      filter === "Tous" ? true : p.category === filter && !p.isPreselected // Filtrer uniquement celles à voter
  );

  const handleVote = async (personalityId: string) => {
    if (!user) return;

    if (confirmedVotes.length >= MAX_VOTES_PER_USER) {
      setVoteLimitReached(true);
      return;
    }

    if (selectedVotes.has(personalityId)) {
      await removeVote("personality", personalityId, user.uid);
      setSelectedVotes((prev) => {
        const newVotes = new Set(prev);
        newVotes.delete(personalityId);
        return newVotes;
      });
      setConfirmedVotes((prev) => prev.filter((id) => id !== personalityId));
    } else {
      setCurrentPersonalityId(personalityId);
      setShowConfirmModal(true);
    }
  };

  const confirmVote = async () => {
    if (currentPersonalityId && user) {
      await addVote("personality", currentPersonalityId, user.uid);
      setSelectedVotes((prev) => new Set([...prev, currentPersonalityId]));
      setConfirmedVotes((prev) => [...prev, currentPersonalityId]);
      setShowConfirmModal(false);
      setCurrentPersonalityId(null);
    }
  };

  const cancelVote = () => {
    setShowConfirmModal(false);
    setCurrentPersonalityId(null);
  };

  return (
      <section className="w-full min-h-screen bg-[url('/path/to/background.jpg')] bg-cover bg-center">
        <div className="mx-auto">


          <section id="personnalities">
            {/* Nouvelle Section: Les Personnalités Pré-Sélectionnées */}
            <div className="space-y-4 mb-8 max-w-[1200px] mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-[#242565] mb-4 font-['Poppins',Helvetica] text-center mt-24">Les Personnalités
                sélectionnées</h3>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-center md:text-[22px]">
                Nous créons un livre unique qui explore l'état et l'évolution de l'information en France.
                À travers les regards croisés de 30 personnalités médiatiques influentes.
              </p>

              <div className="mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-10 px-4 sm:px-0">
                  {filteredPersonalities
                      .filter(personality => personality.isPreselected)
                      .slice(0, visiblePreselectedCount)
                      .map((personality) => (
                          <motion.div key={personality.id} whileHover={{scale: 1.02}} transition={{duration: 0.3}}>
                            <Card
                                className="relative w-full h-[380px] sm:h-[450px] cursor-pointer group perspective">
                              <div
                                  className="relative w-full h-full transition-transform duration-700 transform-style preserve-3d">
                                <div className="absolute w-full h-full backface-hidden ">
                                  <img className="w-full h-full object-cover rounded-lg" src={personality.imageUrl}
                                       alt={personality.name}/>
                                  <div
                                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg"/>
                                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                    <h3 className="font-bold text-xl sm:text-2xl">{personality.name}</h3>
                                    <p className="text-xs sm:text-sm">{personality.title}</p>
                                    <p className="text-xs sm:text-sm font-bold">{personality.company}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                      ))}
                </div>
              </div>

              {/* Boutons Voir Plus / Voir Moins */}

              <div className="text-center mt-12">
                {visiblePreselectedCount < filteredPersonalities.filter(personality => personality.isPreselected).length ? (
                    <button
                        onClick={() => setVisiblePreselectedCount(filteredPersonalities.filter(personality => personality.isPreselected).length)} // Affiche toutes les personnalités pré-sélectionnées
                        className="mt-12 px-6 py-3 text-lg font-medium bg-[#242565] text-white rounded-full transition-all hover:bg-[#242565]"
                    >
                      Voir plus
                    </button>
                ) : (
                    <button
                        onClick={() => setVisiblePreselectedCount(3)} // Réinitialise à 6 personnalités
                        className="mt-10 px-6 py-3 text-lg font-medium bg-[#807ada] text-white rounded-full transition-all hover:bg-gray-600"
                    >
                      Voir moins
                    </button>
                )}
              </div>

            </div>


          </section>


          {/* Nouvelle Section: Les Personnalités à voter */}

          <section className="bg-[#efeff2] w-full pt-10 pb-10 mt-10">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#242565] mb-4 font-['Poppins',Helvetica] text-center mt-10">Les
                personnalités à voter</h2>
              <p className="text-center text-gray-600 mb-10">
                Vous avez voté {confirmedVotes.length}/3 personnalités
              </p>

              {/* Filtres */}
              <div
                  className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-14">
                {["Tous", "Influenceurs/Youtubeurs", "Dirigeant de média", "Journaliste"].map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={cn(
                            "px-6 py-2 rounded-full text-lg font-medium transition-all border-2",
                            filter === category
                                ? "bg-[#232565] text-white"
                                : "bg-transparent text-[#232565] border-[#232565] hover:bg-[#232565] hover:text-white"
                        )}
                    >
                      {category}
                    </button>
                ))}
              </div>


              {/* Affichage du message d'erreur si la limite de votes est atteinte */}
              {voteLimitReached && (
                  <div className="text-center text-red-500 font-bold mt-4">
                    Vous ne pouvez voter que pour 3 personnalités.
                  </div>
              )}

              {/* Affichage des personnalités */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPersonalities.slice(0, visibleCount).map((personality) => (
                    <motion.div key={personality.id} whileHover={{scale: 1.02}} transition={{duration: 0.3}}>
                      <div
                          className="relative w-full h-[380px] sm:h-[450px] cursor-pointer group perspective"
                          onClick={() => setFlippedCard(flippedCard === personality.id ? null : personality.id)}
                      >
                        <div
                            className={cn(
                                "relative w-full h-full transition-transform duration-700 transform-style preserve-3d",
                                flippedCard === personality.id ? "rotate-y-180" : ""
                            )}
                        >
                          {/* Face avant */}
                          <Card
                              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg bg-card text-card-foreground w-[90%] sm:w-full h-[350px] sm:h-[450px] mx-auto cursor-pointer group perspective">
                            <img className="w-full h-full object-cover rounded-lg" src={personality.imageUrl}
                                 alt={personality.name}/>
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg"/>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <h3 className="font-bold text-2xl">{personality.name}</h3>
                              <p className="text-sm">{personality.title}</p>
                              <p className="text-sm font-bold">{personality.company}</p>
                              <div className="mt-2 text-sm">{personality.votesCount} votes</div>
                            </div>

                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(personality.id);
                                }}
                                disabled={confirmedVotes.length >= MAX_VOTES_PER_USER}
                                className={cn(
                                    "absolute top-4 right-4 p-3 rounded-full transition-all duration-300 group",
                                    selectedVotes.has(personality.id)
                                        ? "bg-pink-500 shadow-lg"
                                        : "bg-white/20 hover:bg-white/30"
                                )}
                            >
                              <Heart
                                  className={cn(
                                      "w-6 h-6 transition-all duration-300",
                                      selectedVotes.has(personality.id) ? "text-white fill-current" : "text-white group-hover:scale-110"
                                  )}
                              />
                            </button>
                          </Card>

                          {/* Face arrière */}
                          <Card
                              className="absolute w-full h-full bg-white shadow-lg flex flex-col justify-center items-center text-center p-6 backface-hidden rotate-y-180"
                          >
                            <h3 className="text-2xl font-bold text-[#232565]">{personality.name}</h3>
                            <p className="text-gray-800 mt-4">{personality.description}</p>
                            <button
                                className="absolute top-4 left-4 p-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFlippedCard(null);
                                }}
                            >
                              <ArrowLeft className="w-5 h-5"/>
                            </button>
                          </Card>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>

              <Dialog open={showConfirmModal} onClose={cancelVote}>
                <DialogTitle>
                  Êtes-vous sûr de vouloir voter
                  pour {currentPersonalityId ? filteredPersonalities.find(p => p.id === currentPersonalityId)?.name : ''}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={cancelVote} color="primary">Annuler</Button>
                  <Button onClick={confirmVote} color="primary">Confirmer</Button>
                </DialogActions>
              </Dialog>

              {/* Boutons Voir Plus / Voir Moins */}

              <div className="text-center mt-8">
                {visibleCount < filteredPersonalities.length ? (
                    <button
                        onClick={() => setVisibleCount(filteredPersonalities.length)}
                        className="px-6 py-3 text-lg font-medium bg-[#242565] text-white rounded-full transition-all hover:bg-blue-600 mt-10 mb-10"
                    >
                      Voir plus
                    </button>
                ) : (
                    <button
                        onClick={() => setVisibleCount(6)}
                        className="px-6 py-3 text-lg font-medium bg-gray-500 text-white rounded-full transition-all hover:bg-gray-600"
                    >
                      Voir moins
                    </button>
                )}
              </div>
            </div>
          </section>

          {/* Section des personnalités les plus votées */}

          <section className="bg-[#3582ab] pb-20 border-2 border-[#242565]">
            <h3 className="text-3xl md:text-4xl font-bold font-['Poppins',Helvetica] text-center mt-16 mb-16 text-white">Les
              personnalités les plus votées</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-[1200px]">
              {topVotedPersonalities.map((personality) => (
                  <motion.div key={personality.id} whileHover={{scale: 1.05}} transition={{duration: 0.3}}>
                    <Card className="relative inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg bg-card text-card-foreground w-[90%] sm:w-full h-[350px] sm:h-[450px] mx-auto cursor-pointer group perspective">
                      <img className="w-full h-full object-cover rounded-lg" src={personality.imageUrl}
                           alt={personality.name}/>
                      <div
                          className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 via-transparent to-transparent">
                        <h3 className="font-bold text-2xl">{personality.name}</h3>
                        <p className="text-sm">{personality.title}</p>
                        <p className="text-sm font-bold">{personality.company}</p>
                        <div className="mt-2 text-sm">{personality.votesCount} votes</div>
                      </div>
                    </Card>
                  </motion.div>
              ))}
            </div>
          </section>

        </div>
      </section>
  );
};
