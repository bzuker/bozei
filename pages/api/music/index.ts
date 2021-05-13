import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Called here!!!");
  const { hello } = req.body;

  console.log({ hello });

  res.status(200).json({ ok: hello });
};
