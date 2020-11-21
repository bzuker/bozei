import algoliasearch from "algoliasearch";
import * as functions from "firebase-functions";
import { QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import { Question } from "../../interfaces/game";

// App ID and API Key are stored in functions config variables
const ALGOLIA_ID: string = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY: string = functions.config().algolia.api_key;
const ALGOLIA_INDEX_NAME = "questions";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

export function onQuestionCreated(snap: QueryDocumentSnapshot) {
  const question = snap.data() as Question;

  return saveToIndex(question);
}

export function onQuestionUpdated(change: functions.Change<QueryDocumentSnapshot>) {
  const question = change.after.data() as Question;

  return saveToIndex(question);
}

function saveToIndex(question: Question) {
  try {
    console.log(`Adding ${question.id} to index`);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject({
      ...question,
      objectID: question.id,
    });
  } catch (error) {
    console.error(`Could not save ${question.id} to index`, error);
    throw error;
  }
}
