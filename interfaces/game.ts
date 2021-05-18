import { Timestamp } from "../utils/auth/firebase";

export interface Game {
  id: string;
  userId: string;
  createdAt: typeof Timestamp;
  updatedAt: typeof Timestamp;
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
