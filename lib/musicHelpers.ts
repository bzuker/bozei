import type { Question } from "../pages/music/room/[roomId]";

export const isCorrectAnswer = (id: string, question: Question) =>
  question.guessType === "artist"
    ? question.song.artist.id === id
    : question.song.id === id;
