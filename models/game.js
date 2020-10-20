import { v4 as uuid } from "uuid";
const { gamesRef, Timestamp } = require("../utils/auth/firebase");

const createGame = async (game) => {
  // Set an id for each answer
  game.questions.forEach((q) => {
    q.answers = q.answers.map((a) => ({
      id: uuid(),
      ...a,
    }));

    const correctAnswer = q.answers.find((a) => a.isCorrect);
    q.correctAnswerId = correctAnswer.id;
  });

  const gameDoc = gamesRef.doc();
  await gameDoc.set({
    ...game,
    date: Timestamp.fromDate(new Date()),
  });

  return gameDoc.id;
};

const getGames = async (userId) => {
  if (!userId) {
    return null;
  }

  const gamesSnapshot = await gamesRef.where("userId", "==", userId).get();
  const games = gamesSnapshot.docs.map((g) => {
    const game = g.data();
    return {
      ...game,
      id: g.id,
    };
  });
  return games;
};

const getGameById = async (gameId) => {
  const gameSnapshot = await gamesRef.doc(gameId).get();
  return gameSnapshot.data();
};

const gameApi = {
  createGame,
  getGames,
  getGameById,
};

export default gameApi;
