import { useState } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { Personality, Question, WaitlistEntry, GlobalAssets } from '../types';

export const usePersonalities = () => {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [assets, setAssets] = useState<GlobalAssets[]>([]);
  const [loading, setLoading] = useState(true);

  const voteForPersonality = async (personalityId: string) => {
    if (!auth.currentUser) throw new Error('Must be logged in to vote');

    const voteRef = await addDoc(collection(db, 'votes_personalities'), {
      userId: auth.currentUser.uid,
      personalityId,
      createdAt: new Date()
    });

    await updateDoc(doc(db, 'personalities', personalityId), {
      votesCount: increment(1)
    });

    return voteRef.id;
  };

  return { personalities, loading, voteForPersonality };

};

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const voteForQuestion = async (questionId: string) => {
    if (!auth.currentUser) throw new Error('Must be logged in to vote');

    const voteRef = await addDoc(collection(db, 'votes_questions'), {
      userId: auth.currentUser.uid,
      questionId,
      createdAt: new Date()
    });

    await updateDoc(doc(db, 'questions', questionId), {
      votesCount: increment(1)
    });

    return voteRef.id;
  };

  return { questions, loading, voteForQuestion };
};

export const useWaitlist = () => {
  const addToWaitlist = async (email: string, fullName: string): Promise<string> => {
    const waitlistEntry: Omit<WaitlistEntry, 'id'> = {
      email,
      fullName,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'waitlist'), waitlistEntry);
    return docRef.id;
  };

  return { addToWaitlist };
};