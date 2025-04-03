import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { AuthModal } from "../../../../components/AuthModal";
import { useAuth } from "../../../../lib/hooks/useAuth";
import { useVotes } from "../../../../lib/hooks/useVotes";
import { useFirebaseData } from "../../../../lib/hooks/useFirebaseData";
import { motion } from "framer-motion";
import { Check, AlertCircle, Save } from "lucide-react";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export const QuestionsSection = (): JSX.Element => {
  const { user } = useAuth();
  const { addVote, checkExistingVote } = useVotes();
  const { questions, loading, refreshQuestions } = useFirebaseData();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const sortedQuestions = [...questions].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));

  useEffect(() => {
    const checkPreviousVotes = async () => {
      if (!user) return;

      const votesRef = collection(db, 'votes_questions');
      const q = query(votesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const votedQuestions = new Set();
      querySnapshot.forEach((doc) => {
        votedQuestions.add(doc.data().questionId);
      });

      setSelectedQuestions(votedQuestions);
      if (votedQuestions.size >= 3) {
        setHasSubmitted(true);
      } else {
        setHasSubmitted(false);
      }
    };

    checkPreviousVotes();
  }, [user]);

  // Fonction pour enregistrer un vote et mettre à jour le votesCount
  const addVoteToFirestore = async (questionId: string) => {
    try {
      const votesRef = collection(db, 'votes_questions');
      await addDoc(votesRef, {
        userId: user.uid, // ID de l'utilisateur connecté
        questionId: questionId,
        createdAt: new Date(),
      });

      // Mettre à jour le votesCount dans la question
      const questionRef = doc(db, 'questions', questionId);
      await updateDoc(questionRef, {
        votesCount: increment(1),
      });

      // Rafraîchir les questions pour refléter le nouveau votesCount
      refreshQuestions();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du vote:', error);
      setError('Une erreur est survenue lors de l\'enregistrement du vote');
    }
  };

  const handleQuestionSelect = async (questionId: string) => {
    if (hasSubmitted) {
      setError('Vous avez déjà soumis vos questions');
      return;
    }

    if (!user) {
      setPendingQuestionId(questionId);
      setAuthMessage('Connectez-vous pour voter');
      setShowAuthModal(true);
      return;
    }

    if (selectedQuestions.size >= 3 && !selectedQuestions.has(questionId)) {
      setError('Vous avez atteint le nombre maximum de sélections.');
      return;
    }

    try {
      const hasVoted = await checkExistingVote('question', questionId);
      if (hasVoted) {
        setError('Vous avez déjà voté pour cette question');
        return;
      }

      const newSelected = new Set(selectedQuestions);
      if (newSelected.has(questionId)) {
        newSelected.delete(questionId);
      } else {
        newSelected.add(questionId);
      }
      setSelectedQuestions(newSelected);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la gestion du vote de la question:', error);
      setError('Une erreur est survenue lors du vote');
    }
  };

  const handleSubmitQuestions = async () => {
    if (!user) {
      setAuthMessage('Connectez-vous pour soumettre vos questions');
      setShowAuthModal(true);
      return;
    }

    if (selectedQuestions.size !== 3) {
      setError('Veuillez sélectionner exactement 3 questions');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Enregistrer les votes
      for (const questionId of selectedQuestions) {
        await addVoteToFirestore(questionId);
      }

      setHasSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de la soumission des questions:', error);
      setError('Une erreur est survenue lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAuthSuccess = async () => {
    if (pendingQuestionId) {
      await handleQuestionSelect(pendingQuestionId);
      setPendingQuestionId(null);
    }
  };

  if (loading) {
    return (
        <div className="w-full py-16 flex justify-center items-center">
          <div className="text-[#242565] text-xl">Chargement des questions...</div>
        </div>
    );
  }

  return (
      <>
        <section id="questions" className="w-full pt-36 pb-36 bg-[#f5f5f5]">
          <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#242565] mb-4 font-['Poppins',Helvetica]">
                Votez pour les Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-['DM_Sans',Helvetica] mt-10">
                Sélectionnez 3 questions parmi les proposées. Ces questions seront posées aux personnalités
                sélectionnées.
              </p>
            </motion.div>

            <div className="relative max-w-3xl mx-auto">
              <div className="sticky top-4 z-10 mb-8">
                <Card className="bg-white/80 backdrop-blur-sm border border-[#5522cc]/10 p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedQuestions.size === 3 ? (
                          <Check className="w-5 h-5 text-green-500" />
                      ) : (
                          <AlertCircle className="w-5 h-5 text-[#5522cc]" />
                      )}
                      <span className="font-medium text-[#242565]">
                      {selectedQuestions.size} sur 3 questions sélectionnées
                    </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#5522cc] transition-all duration-300"
                            style={{ width: `${(selectedQuestions.size / 3) * 100}%` }}
                        />
                      </div>
                      {selectedQuestions.size === 3 && !hasSubmitted && (
                          <Button
                              onClick={handleSubmitQuestions}
                              disabled={submitting}
                              className="bg-[#5522cc] hover:bg-[#4411bb]"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {submitting ? 'Enregistrement...' : 'Enregistrer'}
                          </Button>
                      )}
                    </div>
                  </div>
                  {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                  {hasSubmitted && (
                      <p className="text-green-500 text-sm mt-2">
                        Vos questions ont été enregistrées avec succès !
                      </p>
                  )}
                </Card>
              </div>

              <div className="space-y-4">
                {questions.map((question) => (
                    <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                      <Card
                          className={`group transition-all duration-300 hover:shadow-lg ${
                              selectedQuestions.has(question.id)
                                  ? "border-[#5522cc] bg-[#5522cc]/5"
                                  : "border-transparent hover:border-gray-200"
                          } ${hasSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <button
                            className={`w-full p-6 h-auto text-left flex items-start justify-between text-card-foreground bg-white/80 backdrop-blur-sm border border-[#5522cc]/10 p-4 rounded-2xl shadow-lg gap-4 ${
                                hasSubmitted ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                            onClick={() => handleQuestionSelect(question.id)}
                            disabled={hasSubmitted}
                        >
                          <div className="flex-1">
                            <p className="text-lg text-[#242565] font-medium mb-2">
                              {question.text}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{question.votesCount || 0} votes</span>
                            </div>
                          </div>
                          <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  selectedQuestions.has(question.id)
                                      ? "border-[#5522cc] bg-[#5522cc]"
                                      : "border-gray-300 group-hover:border-[#5522cc]"
                              }`}
                          >
                            {selectedQuestions.has(question.id) && (
                                <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </button>
                      </Card>
                    </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <AuthModal
            isOpen={showAuthModal}
            onClose={() => {
              setShowAuthModal(false);
              setPendingQuestionId(null);
              setAuthMessage('');
            }}
            onSuccess={handleAuthSuccess}
            mode="vote"
            message={authMessage}
        />

        <section className="w-full py-16 bg-white mt-10 mb-10">
          <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#242565] mb-4 font-['Poppins',Helvetica] border-[#252121 ] ">
                Questions les plus votées
              </h2>
            </motion.div>
            <div className="space-y-4 max-w-3xl mx-auto">
              {sortedQuestions.slice(0, 3).map((question) => (
                  <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border border-[#5522cc]/10 p-4 rounded-2xl shadow-lg mt-6">
                      <p className="text-lg text-[#242565] font-medium mb-2">{question.text}</p>
                      <div className="text-sm text-gray-500">{question.votesCount || 0} votes</div>
                    </Card>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>
      </>
  );
};
