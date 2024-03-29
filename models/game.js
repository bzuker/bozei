import { v4 as uuid } from "uuid";
import { gamesRef, Timestamp, storage } from "../utils/auth/firebase";

const saveGame = async (game) => {
  // Set an id for each answer
  game.questions.forEach((q) => {
    q.answers = q.answers.map((a) => ({
      id: a.id || uuid(),
      ...a,
    }));

    const correctAnswer = q.answers.find((a) => a.isCorrect);
    q.correctAnswerId = correctAnswer.id;

    q.tags = q.tags || [];
  });

  // Upload image
  if (game.image?.raw) {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`${uuid()}-${game.image.raw.name}`);
    await imageRef.put(game.image.raw);
    game.image = await imageRef.getDownloadURL();
  } else if (game.image === null) {
    // Do nothing, keep game.image in null so it updates it
  } else {
    // No changes, delete the image field so the merge keeps the one in the server
    delete game.image;
  }

  // Get reference to existing or create new one
  const gameDoc = game.id ? gamesRef.doc(game.id) : gamesRef.doc();

  await gameDoc.set(
    {
      createdAt: Timestamp.fromDate(new Date()),
      ...game,
      id: gameDoc.id,
      updatedAt: Timestamp.fromDate(new Date()),
    },
    { merge: true }
  );

  return gameDoc.id;
};

const getGamesForUserId = async (userId) => {
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

const getGames = async ({ orderBy = null, limit = null, startAfter = null, where = null }) => {
  let query = gamesRef;

  if (where) {
    query = query.where(...where);
  }

  if (orderBy) {
    query = query.orderBy(orderBy);
  }

  if (limit) {
    query = query.limit(limit);
  }

  if (startAfter) {
    query = query.startAfter(startAfter);
  }

  const gamesSnapshot = await query.get();
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

const savePlayedStat = async ({ gameId, statId, stat }) => {
  // Get reference to existing stat or create new
  const gameDoc = gamesRef.doc(gameId);
  const statDoc = statId
    ? gameDoc.collection("played").doc(statId)
    : gameDoc.collection("played").doc();

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
  getGamesForUserId,
  getGames,
  getGameById,
  deleteGameById,
  savePlayedStat,
};

export default gameApi;
