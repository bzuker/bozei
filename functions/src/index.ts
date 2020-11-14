import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Game } from "../../interfaces/game";

admin.initializeApp();

const db = admin.firestore();
const questionsRef = db.collection("questions");

// const areQuestionsEqual = (q1: Question, q2: Question) => {
//   if (q1.answers.length !== q2.answers.length) {
//     return false;
//   }

//   for (let i = 0; i < q1.answers.length; i++) {
//     const answer1 = q1.answers[i];
//     const answer2 = q2.answers[i];

//     if (
//       answer1.id !== answer2.id ||
//       answer1.isCorrect !== answer2.isCorrect ||
//       answer1.text !== answer2.text
//     ) {
//       return false;
//     }
//   }

//   return q1.correctAnswerId === q2.correctAnswerId && q1.text === q2.text;
// };

exports.addQuestions = functions.firestore.document("/games/{gameId}").onCreate(async (snap) => {
  const game = snap.data() as Game;

  if (!game.isPublic) {
    console.log("Ignoring non public game");
    return null;
  }

  console.log(`Adding ${game.questions.length} questions`);
  const promises = game.questions.map((q) => {
    const questionDoc = questionsRef.doc(q.id);
    return questionDoc.set({ ...q, isPublic: true });
  });

  await Promise.all(promises);
  console.log("Questions added correctly");

  return true;
});

exports.updateQuestions = functions.firestore
  .document("/games/{gameId}")
  .onUpdate(async (change) => {
    const game = change.after.data() as Game;
    const oldGame = change.before.data() as Game;

    // If game was public and was made private, delete all questions
    if (oldGame.isPublic && !game.isPublic) {
      const promises = oldGame.questions.map((q) => {
        const questionDoc = questionsRef.doc(q.id);
        return questionDoc.delete();
      });

      console.log(`Deleting ${promises.length} questions that are now private`);
      return Promise.all(promises);
    }

    // Game was private and was made public, add all questions
    if (!oldGame.isPublic && game.isPublic) {
      const promises = game.questions.map((q) => {
        const questionDoc = questionsRef.doc(q.id);
        return questionDoc.set(q);
      });

      console.log(`Adding ${promises.length} questions that are now public`);
      return Promise.all(promises);
    }

    // Ignore non public games
    if (!game.isPublic) {
      console.log("Ignoring non public game");
      return null;
    }

    // Here the game was public and remains public

    // Check if any question was deleted
    const deletedQuestions = oldGame.questions.filter(
      (oldQuestion) => !game.questions.some((q) => q.id === oldQuestion.id)
    );

    console.log(`deleting ${deletedQuestions.length} questions`);
    const deletePromises = deletedQuestions.map((q) => {
      const questionDoc = questionsRef.doc(q.id);
      return questionDoc.delete();
    });

    // TODO: this could be optimized to only update questions that were modified.
    const updatePromises = game.questions.map((q) => {
      const questionDoc = questionsRef.doc(q.id);
      return questionDoc.set(q);
    });

    await Promise.all([...deletePromises, ...updatePromises]);
    console.log("done updating");
    return true;
  });

exports.deleteQuestions = functions.firestore.document("/games/{gameId}").onDelete(async (snap) => {
  const game = snap.data() as Game;

  // Ignore private game deleted
  if (!game.isPublic) {
    return null;
  }

  console.log(`deleting ${game.questions.length} questions`);
  const deletePromises = game.questions.map((q) => {
    const questionDoc = questionsRef.doc(q.id);
    return questionDoc.delete();
  });

  await Promise.all(deletePromises);
  console.log("deleted questions");
  return true;
});
