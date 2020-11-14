import * as admin from "firebase-admin";
import { Question } from "../../interfaces/game";
import game from "./game.json";

// const waitSeconds = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000));

const projectId = "bozei-0";
process.env.GCLOUD_PROJECT = projectId;
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

let app: admin.app.App;
let db: FirebaseFirestore.Firestore;

beforeAll(() => {
  app = admin.initializeApp({ projectId });
  db = admin.firestore(app);
});

afterAll(async () => {
  await clearGamesAndQuestions(db);
  await app.delete();
});

describe("game created", () => {
  afterEach(async () => {
    await clearGamesAndQuestions(db);
  });

  it("should create questions for the created game", async () => {
    await db.collection("games").add(game);

    await new Promise((resolve) => {
      const expectedCount = 4;
      const unsubscribe = db.collection("questions").onSnapshot((snap) => {
        const allQuestionsCreated = snap.docs.every((x) => {
          const question = x.data() as Question;
          const questionInGame = game.questions.find((q) => q.id === question.id);
          return (
            question.text === questionInGame?.text &&
            question.correctAnswerId === questionInGame?.correctAnswerId
          );
        });

        if (expectedCount === snap.size && allQuestionsCreated) {
          unsubscribe();
          resolve();
        }
      });
    });
  });
});

describe("game updated", () => {
  let gameDoc: FirebaseFirestore.DocumentReference;
  beforeAll(async () => {
    gameDoc = db.collection("games").doc();
    await gameDoc.set(game);
  });

  afterEach(async () => {
    await clearGamesAndQuestions(db);
  });

  it("should update questions if they were updated", async () => {
    const newQuestions = game.questions.map((q, i) => ({ ...q, correctAnswerId: i }));
    await db
      .collection("games")
      .doc(gameDoc.id)
      .set(
        {
          questions: newQuestions.slice(0, 2),
        },
        { merge: true }
      );
    // await new Promise((resolve) => {
    //   const expectedCount = 4;
    //   const unsubscribe = db.collection("questions").onSnapshot((snap) => {
    //     const allQuestionsCreated = snap.docs.every((x) => {
    //       const question = x.data() as Question;
    //       const questionInGame = game.questions.find((q) => q.id === question.id);
    //       return (
    //         question.text === questionInGame?.text &&
    //         question.correctAnswerId === questionInGame?.correctAnswerId
    //       );
    //     });
    //     if (expectedCount === snap.size && allQuestionsCreated) {
    //       unsubscribe();
    //       resolve();
    //     }
    //   });
    // });
  });
});

/**
 * Clear all test data.
 * @param {firebase.firestore.Firestore} db
 */
async function clearGamesAndQuestions(db: FirebaseFirestore.Firestore) {
  const deleteBatch = db.batch();
  const games = await db.collection("games").get();
  for (const game of games.docs) {
    deleteBatch.delete(game.ref);
  }

  const questions = await db.collection("questions").get();
  for (const question of questions.docs) {
    deleteBatch.delete(question.ref);
  }

  await deleteBatch.commit();
}
