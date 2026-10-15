const { session } = require("./_lib");
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const s = await session(req, res);
  s.destroy();
  return res.status(200).json({ ok: true });
};
