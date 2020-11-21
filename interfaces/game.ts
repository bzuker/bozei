import { firestore } from "firebase";

export interface Game {
  id: string;
  userId: string;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
  title: string;
  description: string;
  image: string;
  isPublic: boolean;
  questions: Array<Question>;
}

export interface Question {
  id: string;
  answers: Array<Answer>;
  correctAnswerId: string;
  text: string;
  tags: Array<{ value: string; label: string }>;
  external: boolean;
}

export interface Answer {
  id: string;
  isCorrect: boolean;
  text: string;
}
