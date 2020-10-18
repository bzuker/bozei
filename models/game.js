const { gamesRef, Timestamp } = require("../utils/auth/firebase");

const createGame = async (game) => {
  const gameDoc = gamesRef.doc();
  await gameDoc.set({
    ...game,
    date: Timestamp.fromDate(new Date()),
  });

  return gameDoc.id;
};

const getGames = async (userId) => {
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

const gameApi = {
  createGame,
  getGames,
};

export default gameApi;
