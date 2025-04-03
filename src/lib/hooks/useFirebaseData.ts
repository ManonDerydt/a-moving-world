import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Personality, Question } from "../types";

export const useFirebaseData = () => {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [selectedPersonalities, setSelectedPersonalities] = useState<Personality[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Charger toutes les questions
        const questionsSnapshot = await getDocs(collection(db, "questions"));
        const questionsData = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          isPreselected: doc.data().isPreselected,
          votesCount: doc.data().votesCount || 0,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Question[];
        setQuestions(questionsData);

        // Charger toutes les personnalités
        const personalitiesSnapshot = await getDocs(collection(db, "personalities"));
        const personalitiesData = personalitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          title: doc.data().title,
          company: doc.data().company,
          isPreselected: doc.data().isPreselected,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
          category: doc.data().category,
          votesCount: doc.data().votesCount || 0,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Personality[];

        setPersonalities(personalitiesData);

        // Filtrer les personnalités pré-sélectionnées
        const preselected = personalitiesData.filter((personality) => personality.isPreselected);
        setSelectedPersonalities(preselected);

        setLoading(false);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Erreur lors du chargement initial des données");
        setLoading(false);
      }
    };

    loadInitialData();

    // Configuration des écouteurs Firestore
    const questionsQuery = query(collection(db, "questions"), orderBy("votesCount", "desc"));
    const personalitiesQuery = query(collection(db, "personalities"), orderBy("votesCount", "desc"));

    const unsubscribeQuestions = onSnapshot(
        questionsQuery,
        (snapshot) => {
          try {
            const questionsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              text: doc.data().text,
              votesCount: doc.data().votesCount || 0,
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Question[];
            setQuestions(questionsData);
          } catch (err) {
            console.error("Error processing questions data:", err);
            setError("Erreur lors du traitement des questions");
          }
        },
        (err) => {
          console.error("Error in questions listener:", err);
          setError("Erreur lors de l'écoute des questions");
        }
    );

    const unsubscribePersonalities = onSnapshot(
        personalitiesQuery,
        (snapshot) => {
          try {
            const personalitiesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              title: doc.data().title,
              company: doc.data().company,
              isPreselected: doc.data().isPreselected,
              description: doc.data().description,
              imageUrl: doc.data().imageUrl,
              category: doc.data().category,
              votesCount: doc.data().votesCount || 0,
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Personality[];

            setPersonalities(personalitiesData);

            // Filtrer uniquement les personnalités présélectionnées
            const preselected = personalitiesData.filter((personality) => personality.isPreselected);
            setSelectedPersonalities(preselected);
          } catch (err) {
            console.error("Error processing personalities data:", err);
            setError("Erreur lors du traitement des personnalités");
          }
        },
        (err) => {
          console.error("Error in personalities listener:", err);
          setError("Erreur lors de l'écoute des personnalités");
        }
    );

    // Nettoyer les écouteurs lorsque le composant est démonté
    return () => {
      unsubscribeQuestions();
      unsubscribePersonalities();
    };
  }, []);

  return {
    personalities,
    selectedPersonalities,
    questions,
    loading,
    error,
  };
};
