const { requireAuth } = require("./_lib");
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const s = await requireAuth(req, res);
    return res.status(200).json({ authenticated: !!s });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Session configuration error." });
  }
};
