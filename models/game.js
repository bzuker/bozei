const { gamesRef, Timestamp } = require("../utils/auth/firebase");

const createGame = async (game) => {
  const gameDoc = gamesRef.doc();
  await gameDoc.set({
    ...game,
    date: Timestamp.fromDate(new Date()),
  });

  return gameDoc.id;
};

const gameApi = {
  createGame,
};

export default gameApi;
