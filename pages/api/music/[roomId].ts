import { NextApiRequest, NextApiResponse } from "next";
import { protos } from "@google-cloud/tasks";
import { getPlaylistItems } from "../../../lib/spotify";
import { createTask } from "../../../lib/taskQueue";
import { musicRoomsRef, Timestamp } from "../../../utils/auth/firebase";
import { RoomData, RoomSettings, RoomStatus } from "../../music/room/[roomId]";
import { CallType, Room } from "../../../models/Room";

function buildTask(
  roomId: string,
  roomData: Partial<RoomData>
): Parameters<typeof createTask>[0] {
  const payload = JSON.stringify({ type: CallType.UPDATE, roomData });
  return {
    httpRequest: {
      httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
      url: `https://2facace7fef7.ngrok.io/api/music/${roomId}`,
      body: Buffer.from(payload).toString("base64"),
      headers: {
        "Content-Type": "application/json",
      },
    },
    scheduleTime: {
      seconds: roomData.roundStartTimestamp.seconds,
    },
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { roomId } = req.query;
  const { type }: { type: CallType } = req.body;

  console.log(`Got request with type ${type} at ${new Date().toISOString()}`);

  if (typeof roomId !== "string") return res.status(500).json({ ok: false });
  if (!(type in CallType)) return res.status(500).json({ ok: false });

  const roomRef = musicRoomsRef.doc(roomId);

  switch (type) {
    case CallType.CREATE: {
      const { user } = req.body;
      const initialData = Room.getInitialData(roomId, user);
      await roomRef.set(initialData);

      return res.status(200).json({ room: initialData });
    }

    case CallType.START: {
      const { settings }: { settings: RoomSettings } = req.body;
      // Get tracks for the room
      const tracks = await getPlaylistItems(
        settings.playlist.id,
        settings.roundQuantity
      );

      const roomData: Partial<RoomData> = {
        status: RoomStatus.Starting,
        playedSongs: [],
        roundQuantity: settings.roundQuantity,
        settings,
        tracks,
        roundStartTimestamp: Timestamp.now(),
        roundEndsTimestamp: Timestamp.fromMillis(
          Timestamp.now().toMillis() + 1000 * 5
        ),
      };

      const nextData = Room.getNextData(roomData);
      const task = buildTask(roomId, nextData);
      const response = await createTask(task);
      await roomRef.update(roomData);
      console.log(
        `Created task at ${new Date().toISOString()}. Scheduled for ${Timestamp.fromMillis(
          parseInt(response.scheduleTime.seconds.toString()) * 1000
        )
          .toDate()
          .toISOString()}`
      );

      return res.status(200).json({ room: nextData });
    }

    case CallType.UPDATE: {
      const { roomData }: { roomData: Partial<RoomData> } = req.body;
      console.log({ roomData, headers: req.headers });

      const roundStartTimestamp =
        roomData.roundStartTimestamp &&
        Timestamp.fromMillis(roomData.roundStartTimestamp.seconds * 1000);
      const roundEndsTimestamp =
        roomData.roundEndsTimestamp &&
        Timestamp.fromMillis(roomData.roundEndsTimestamp.seconds * 1000);

      const fixedRoomData: Partial<RoomData> = {
        ...roomData,
        roundStartTimestamp,
        roundEndsTimestamp,
      };

      await roomRef.update(fixedRoomData);

      const nextData = Room.getNextData(fixedRoomData);

      // If there's no more data, game has ended.
      if (!nextData) {
        return res.status(200).json({ room: null });
      }

      const task = buildTask(roomId, nextData);
      const response = await createTask(task);
      console.log(
        `Created task at ${new Date().toISOString()}. Scheduled for ${Timestamp.fromMillis(
          parseInt(response.scheduleTime.seconds.toString()) * 1000
        )
          .toDate()
          .toISOString()}`
      );

      return res.status(200).json({ room: fixedRoomData });
    }
  }
};
