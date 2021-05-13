import { NextApiRequest, NextApiResponse } from "next";
import { getPlaylists } from "../../../lib/spotify";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { categoryId } = req.query;

  if (typeof categoryId !== "string")
    return res.status(500).json({ ok: false });

  const playlists = await getPlaylists(categoryId);

  return res.status(200).json(playlists);
};
