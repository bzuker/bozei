import { RoomStatus, RoomData } from "../pages/music/room/[roomId]";
import { Timestamp } from "../utils/auth/firebase";

export enum CallType {
  CREATE = "CREATE",
  START = "START",
  UPDATE = "UPDATE",
}

export class Room {
  static getInitialData(roomId: string, user): RoomData {
    return {
      roomId,
      createdBy: user,
      status: RoomStatus.Settings,
      players: [user],
      playedSongs: [],
      tracks: [],
      round: 0,
      roundQuantity: 0,
      roundStartTimestamp: null,
      roundEndsTimestamp: null,
      currentRound: null,
      settings: {
        roundQuantity: 0,
        category: null,
        playlist: null,
        difficulty: null,
      },
    };
  }

  static getNextData(roomData: Partial<RoomData>): Partial<RoomData> {
    switch (roomData.status) {
      case RoomStatus.Starting: {
        // Get the next song to play
        const song = roomData.tracks.pop();
        // Start the next round when this one ends
        const roundStartTimestamp = roomData.roundEndsTimestamp;
        return {
          ...roomData,
          status: RoomStatus.Question,
          currentRound: {
            question: { song, guessType: "song" },
            playerScores: [],
            playerAnswers: [],
          },
          tracks: roomData.tracks,
          round: 1,
          roundStartTimestamp,
          roundEndsTimestamp: calculateEndTimestamp(
            roundStartTimestamp,
            roomData.settings.difficulty.seconds
          ),
        };
      }

      case RoomStatus.Question: {
        const roundStartTimestamp = roomData.roundEndsTimestamp;
        const { currentRound, ...rest } = roomData;
        return {
          ...rest,
          status: RoomStatus.Answers,
          playedSongs: [...roomData.playedSongs, currentRound.question.song],
          roundStartTimestamp,
          roundEndsTimestamp: calculateEndTimestamp(roundStartTimestamp, 5),
        };
      }

      case RoomStatus.Answers: {
        // If it's the last round, go to LeaderBoard
        if (roomData.round === roomData.roundQuantity) {
          return {
            ...roomData,
            status: RoomStatus.LeaderBoard,
            currentRound: null,
            roundStartTimestamp: roomData.roundEndsTimestamp,
            roundEndsTimestamp: null,
          };
        }

        const roundStartTimestamp = roomData.roundEndsTimestamp;
        return {
          ...roomData,
          status: RoomStatus.RoundLeaderBoard,
          roundStartTimestamp,
          // Fixed time between rounds
          roundEndsTimestamp: calculateEndTimestamp(roundStartTimestamp, 4),
        };
      }

      case RoomStatus.RoundLeaderBoard: {
        // Get the next song to play
        const song = roomData.tracks.pop();
        // Start the next round when this one ends
        const roundStartTimestamp = roomData.roundEndsTimestamp;
        return {
          ...roomData,
          status: RoomStatus.Question,
          currentRound: {
            question: {
              song,
              guessType: roomData.round % 2 === 0 ? "song" : "artist",
            },
            playerScores: [],
            playerAnswers: [],
          },
          tracks: roomData.tracks,
          round: roomData.round + 1,
          roundStartTimestamp,
          roundEndsTimestamp: calculateEndTimestamp(
            roundStartTimestamp,
            roomData.settings.difficulty.seconds
          ),
        };
      }

      case RoomStatus.LeaderBoard: {
        // Game ended
        return null;
      }
    }
  }
}

function calculateEndTimestamp(
  startTimestamp: RoomData["roundStartTimestamp"],
  seconds: number
): RoomData["roundEndsTimestamp"] {
  // Add a little skew
  const endTimeMs = startTimestamp.toMillis() + seconds * 1000 + 1000;
  return Timestamp.fromMillis(endTimeMs);
}
