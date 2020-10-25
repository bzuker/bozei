import { useRouter } from "next/router";
import useSWR from "swr";
import GameForm from "../../../components/GameForm";
import gameApi from "../../../models/game";

function Edit() {
  const router = useRouter();
  const { gameId } = router.query;
  const { data: game, error } = useSWR([gameId], gameApi.getGameById);

  if (!game) {
    return null;
  }

  return <GameForm existingGame={game} />;
}

export default Edit;
