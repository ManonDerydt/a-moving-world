export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Personality {
  id: string;
  name: string;
  title: string;
  company: string;
  description: string;
  imageUrl: string;
  category: 'Dirigeant de média' | 'Journaliste' | 'Influenceurs/Youtubeurs';
  isPreselected: boolean;
  votesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface selectedPersonality {
  isPreselected: boolean;
}

export interface Question {
  id: string;
  text: string;
  votesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VotePersonality {
  id: string;
  userId: string;
  personalityId: string;
  createdAt: Date;
}

export interface VoteQuestion {
  id: string;
  userId: string;
  questionId: string;
  createdAt: Date;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}