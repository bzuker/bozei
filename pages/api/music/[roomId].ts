import { NextApiRequest, NextApiResponse } from "next";
import { protos } from "@google-cloud/tasks";
import { getPlaylistItems, getReccomendations } from "../../../lib/spotify";
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
      url: `https://95c4767afb83.ngrok.io/api/music/${roomId}`,
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function pickRandomElements<T extends { id: string }>(
  arr: Array<T>,
  n: number,
  avoidId: string
) {
  const filteredArray = arr.filter((x) => x.id !== avoidId);
  let result = new Array(n),
    len = filteredArray.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = filteredArray[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
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

      const artists = tracks.map((x) => x.artist.id).slice(0, 5);
      const recommendations = await getReccomendations(artists);

      const tracksWithOptions = tracks.map((track) => ({
        ...track,
        artistOptions: shuffleArray([
          ...pickRandomElements(recommendations.artists, 3, track.artist.id),
          track.artist,
        ]),
        trackOptions: shuffleArray([
          ...pickRandomElements(recommendations.songs, 3, track.id),
          track,
        ]),
      }));

      const roomData: Partial<RoomData> = {
        status: RoomStatus.Starting,
        playedSongs: [],
        roundQuantity: settings.roundQuantity,
        settings,
        tracks: tracksWithOptions,
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
