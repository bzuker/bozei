import { v4 as uuid } from "uuid";
import { gamesRef, Timestamp } from "../utils/auth/firebase";

const saveGame = async (game) => {
  // Set an id for each answer
  game.questions.forEach((q) => {
    q.answers = q.answers.map((a) => ({
      id: a.id || uuid(),
      ...a,
    }));

    const correctAnswer = q.answers.find((a) => a.isCorrect);
    q.correctAnswerId = correctAnswer.id;
  });

  // Get reference to existing or create new one
  const gameDoc = game.id ? gamesRef.doc(game.id) : gamesRef.doc();

  await gameDoc.set({
    ...game,
    id: gameDoc.id,
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
  return {
    id: gameId,
    ...gameSnapshot.data(),
  };
};

const deleteGameById = async (gameId) => {
  await gamesRef.doc(gameId).delete();
};

const saveStat = async ({ gameId, statId, stat }) => {
  // Get reference to existing stat or create new
  const gameDoc = gamesRef.doc(gameId);
  const statDoc = statId
    ? gameDoc.collection("stats").doc(statId)
    : gameDoc.collection("stats").doc();

  await statDoc.set(
    {
      ...stat,
      date: Timestamp.fromDate(new Date()),
    },
    { merge: true }
  );

  return statDoc.id;
};

const gameApi = {
  saveGame,
  getGames,
  getGameById,
  deleteGameById,
  saveStat,
};

export default gameApi;
