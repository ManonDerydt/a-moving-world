import { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, increment, serverTimestamp } from 'firebase/firestore';

export const useVotes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkExistingVote = async (type: 'personality' | 'question', id: string) => {
    if (!auth.currentUser) return false;

    const votesCollection = type === 'personality' ? 'votes_personalities' : 'votes_questions';
    const q = query(
      collection(db, votesCollection),
      where('userId', '==', auth.currentUser.uid),
      where(`${type}Id`, '==', id)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const addVote = async (type: 'personality' | 'question', id: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        throw new Error('Non connecté');
      }

      const hasVoted = await checkExistingVote(type, id);
      if (hasVoted) {
        throw new Error('Vous avez déjà voté');
      }

      const votesCollection = type === 'personality' ? 'votes_personalities' : 'votes_questions';
      const itemCollection = type === 'personality' ? 'personalities' : 'questions';

      // Add vote with server timestamp
      await addDoc(collection(db, votesCollection), {
        userId: auth.currentUser.uid,
        [`${type}Id`]: id,
        createdAt: serverTimestamp()
      });

      // Update vote count and timestamp
      const itemRef = doc(db, itemCollection, id);
      await updateDoc(itemRef, {
        votesCount: increment(1),
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addVote, checkExistingVote, loading, error };
};