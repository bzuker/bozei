import firebase from "firebase";
import { isCorrectAnswer } from "../lib/musicHelpers";
import { RoomStatus, RoomData } from "../pages/music/room/[roomId]";
import { Timestamp } from "../utils/auth/firebase";

export enum CallType {
  CREATE = "CREATE",
  START = "START",
  UPDATE = "UPDATE",
}

export class Room {
  static getUpdatedPlayerScores(
    players: RoomData["players"],
    currentScores: RoomData["players"]
  ): RoomData["players"] {
    return players
      .map((x) => ({
        ...x,
        score: x.score + (currentScores.find((p) => p.id === x.id)?.score || 0),
      }))
      .sort((a, b) => b.score - a.score);
  }

  static buildCurrentRoundPlayerScores(dbRoomData: RoomData) {
    const {
      currentRound: { playerAnswers, question },
      roundStartTimestamp,
      settings,
      players,
    } = dbRoomData;
    const scores = playerAnswers.map<RoomData["players"][0]>((answer) => {
      const player = players.find((x) => x.id === answer.playerId);
      if (!player) return null;

      // Check if the answer was correct
      if (!isCorrectAnswer(answer.answerId, question)) {
        return {
          ...player,
          score: 0,
        };
      }
      // Calculate how many seconds the player took to answer
      const secondsToAnswer =
        (answer.timestamp.toMillis() - roundStartTimestamp.toMillis()) / 1000;

      /* 1. Divide response time by the question timer. For example, a player responded 2 seconds after a 30-second question timer started. 2 divided by 30 is 0.0667. */
      const step1 = secondsToAnswer / settings.difficulty.seconds;
      /* 2. Divide that value by 2. For example, 0.0667 divided by 2 is 0.0333. */
      const step2 = step1 / 2;
      /* 3. Subtract that value from 1. For example, 1 minus 0.0333 is 0.9667. */
      const step3 = 1 - step2;
      /* 4. Multiply points possible by that value. For example, 1000 points possible multiplied by 0.9667 is 966.7. */
      const step4 = step3 * 1000;
      /* 5. Round to the nearest whole number. For example, 966.7 is 967 points. */
      const step5 = Math.round(step4);

      return { ...player, score: step5 };
    });

    return scores.filter((x) => x).sort((a, b) => b.score - a.score);
  }

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
          roundEndsTimestamp: calculateEndTimestamp(roundStartTimestamp, 3),
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
