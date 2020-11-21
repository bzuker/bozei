import algoliasearch from "algoliasearch";
import { NextApiRequest, NextApiResponse } from "next";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);
const index = client.initIndex("questions");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { text } = req.query;
  const results = await index.search(text as string, {
    hitsPerPage: 10,
  });

  res.status(200).json(results);
};
