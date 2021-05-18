import { CloudTasksClient, protos } from "@google-cloud/tasks";

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const queue = process.env.BOZEI_QUEUE_NAME;
const location = "southamerica-east1"; // Queue location

export async function createTask(task: protos.google.cloud.tasks.v2.ITask) {
  const tasksClient = new CloudTasksClient({
    projectId: project,
    credentials: {
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
  });

  const queuePath: string = tasksClient.queuePath(project, location, queue);
  const [response] = await tasksClient.createTask({ parent: queuePath, task });

  return response;
}
