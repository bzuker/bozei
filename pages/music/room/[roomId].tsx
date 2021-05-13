import React, { useEffect, useState } from "react";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import firebase from "firebase/app";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
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

export interface Song {
  id: string;
  name: string;
  artist: {
    id: string;
    name: string;
  };
  image: string;
  url: string;
  playlist: string;
}

export enum RoomStatus {
  Settings = "Settings",
  Starting = "Starting",
  Question = "Question",
  Answers = "Answers",
  RoundLeaderBoard = "RoundLeaderBoard",
  LeaderBoard = "LeaderBoard",
}

interface Question {
  song: Song;
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

const fakeDataSeed = {
  playedSongs: [
    {
      artist: { name: "Gustavo Cerati", id: "1QOmebWGB6FdFtW7Bo3F0W" },
      id: "17eJyYLIlMNlOqcwHYJ9F2",
      url: "https://p.scdn.co/mp3-preview/f30b9568b98847b0e9c9c884ec9d51277b128d05?cid=638ca6343c6b4e3fa87ced1f010e5131",
      name: "Lago en el Cielo",
      playlist: "37i9dQZF1DWZU5DGR2xCSH",
      image: "https://i.scdn.co/image/ab67616d0000b273d543f7c7de880da5370922c0",
    },
    {
      url: "https://p.scdn.co/mp3-preview/a48825e7ec11c2a7df0546dbfc23d4cebc5e8ef9?cid=638ca6343c6b4e3fa87ced1f010e5131",
      artist: { name: "Divididos", id: "6ZIgPKHzpcswB8zh7sRIhx" },
      name: "Nene de Antes",
      id: "0VZpqCugL1y5mBGPkw0foP",
      playlist: "37i9dQZF1DWZU5DGR2xCSH",
      image: "https://i.scdn.co/image/ab67616d0000b273430ea4b7eccf14b192745465",
    },
    {
      url: "https://p.scdn.co/mp3-preview/af343cf9e78c0bd873acd2a63a8a5d8535109179?cid=638ca6343c6b4e3fa87ced1f010e5131",
      image: "https://i.scdn.co/image/ab67616d0000b273046b5788fefee283df96dc3f",
      id: "0mUm43Yjv9vPqR8YycWyJs",
      name: "Foxtrot",
      playlist: "37i9dQZF1DWZU5DGR2xCSH",
      artist: { id: "5AQlQBU9LCmQwReukeom2I", name: "Juanse" },
    },
    {
      image: "https://i.scdn.co/image/ab67616d0000b273217ce66ac32c161c7516228c",
      playlist: "37i9dQZF1DWZU5DGR2xCSH",
      id: "2qBirMakpTdz9ymxrZEyzg",
      artist: { id: "1MuQ2m2tg7naeRGAOxYZer", name: "Luis Alberto Spinetta" },
      name: "Seguir Viviendo Sin Tu Amor",
      url: null,
    },
    {
      image: "https://i.scdn.co/image/ab67616d0000b273e4b8ec3d2ffe1f77c7185d48",
      artist: { id: "3tAICgiSR5PfYY4B8qsoAU", name: "Andrés Calamaro" },
      playlist: "37i9dQZF1DWZU5DGR2xCSH",
      id: "6guoJhM9n5Fm7npXJ1rfsM",
      url: "https://p.scdn.co/mp3-preview/a913461761ea825a829fa747b8a48f38c07ace1d?cid=638ca6343c6b4e3fa87ced1f010e5131",
      name: "Crímenes perfectos",
    },
  ],
  time: null,
  timeLeft: null,
  roundQuantity: 5,
  roomId: "1234",
  players: [
    {
      email: "brianzuker@gmail.com",
      photoURL:
        "https://lh4.googleusercontent.com/-8i_oix19uOI/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclAGbV9kPvgjSDrs9cjoqV3LTjzlA/photo.jpg",
      displayName: "Brian Zuker",
      id: "2ymbecjqkSVGbCNEyuFvp4DjSMN2",
      score: 0,
    },
  ],
  status: RoomStatus.RoundLeaderBoard,
  createdBy: {
    email: "brianzuker@gmail.com",
    photoURL:
      "https://lh4.googleusercontent.com/-8i_oix19uOI/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclAGbV9kPvgjSDrs9cjoqV3LTjzlA/photo.jpg",
    displayName: "Brian Zuker",
    id: "2ymbecjqkSVGbCNEyuFvp4DjSMN2",
  },
  round: 5,
  tracks: [],
  settings: {
    category: {
      id: "rock",
      imageUrl:
        "https://t.scdn.co/media/derived/rock_9ce79e0a4ef901bbd10494f5b855d3cc_0_0_274_274.jpg",
      name: "Rock",
    },
    roundQuantity: 5,
    difficulty: { description: "Difícil (10s)", seconds: 10, id: "hard" },
    playlist: {
      name: "Iconos del Rock Argentino",
      imageUrl:
        "https://i.scdn.co/image/ab67706f000000038892160d0c1a21be64c52eac",
      id: "37i9dQZF1DWZU5DGR2xCSH",
    },
  },
  currentRound: {
    playerScores: [],
    question: null,
  },
  roundStartTimestamp: Timestamp.fromMillis(Date.now()),
  roundEndsTimestamp: Timestamp.fromMillis(Date.now() + 1000 * 3),
};

export const RoomPage: React.FC<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ categories, roomId }) => {
  const { user } = useUser();
  const [roomData, loading, error] = useDocumentData<RoomData>(
    musicRoomsRef.doc(roomId)
  );

  // const [fakeData, setFakeData] = useState(fakeDataSeed);

  // console.log(fakeData);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setFakeData({
  //       ...fakeData,
  //       roundStartTimestamp: Timestamp.fromMillis(Date.now()),
  //       roundEndsTimestamp: Timestamp.fromMillis(Date.now() + 1000 * 3),
  //     });
  //   }, 1000 * 3);
  // }, []);

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
