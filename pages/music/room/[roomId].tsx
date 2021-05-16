import React, { useEffect, useState } from "react";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import firebase from "firebase/app";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Layout from "../../../components/layout";
import Room from "../../../components/music/Room";
import { getCategories } from "../../../lib/spotify";
import { musicRoomsRef, Timestamp } from "../../../utils/auth/firebase";
import { useUser } from "../../../context/Auth";

interface Player {
  id: string;
  email: string;
  photoURL: string;
  displayName: string;
  score: number;
}

export interface Artist {
  id: string;
  name: string;
}

export interface Song {
  id: string;
  name: string;
  artist: Artist;
  image: string;
  url: string;
  playlist: string;
  artistOptions: Artist[];
  trackOptions: Song[];
}

export enum RoomStatus {
  Settings = "Settings",
  Starting = "Starting",
  Question = "Question",
  Answers = "Answers",
  RoundLeaderBoard = "RoundLeaderBoard",
  LeaderBoard = "LeaderBoard",
}

export interface Question {
  song: Song;
  guessType: "song" | "artist";
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  imageUrl: string;
}

interface Round {
  question: Question;
  playerScores: Player[];
  playerAnswers: {
    playerId: string;
    answerId: string;
    timestamp: firebase.firestore.Timestamp;
  }[];
}

export interface RoomSettings {
  category: Category;
  playlist: Playlist;
  difficulty: { id: string; seconds: number; description: string };
  roundQuantity: number;
}

export interface RoomData {
  roomId: string;
  createdBy: Omit<Player, "score">;
  players: Player[];
  playedSongs: Song[];
  tracks: Song[];
  status: RoomStatus;
  round: number;
  roundQuantity: number;
  roundStartTimestamp: firebase.firestore.Timestamp;
  roundEndsTimestamp: firebase.firestore.Timestamp;
  settings: RoomSettings;
  currentRound: Round;
}

export const RoomPage: React.FC<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ categories, roomId }) => {
  const { user } = useUser();
  const [roomData, loading, error] = useDocumentData<RoomData>(
    musicRoomsRef.doc(roomId)
  );

  return (
    <Layout>
      <Room data={roomData} categories={categories} />
    </Layout>
  );
};

export const getStaticProps = async ({ params }) => {
  const categories = await getCategories();
  return {
    props: { categories, roomId: params.roomId },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default RoomPage;
