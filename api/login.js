const { session } = require("./_lib");
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.FREELANCE_PASSWORD || !process.env.SESSION_SECRET || !process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: "Server setup incomplete. Configure Vercel environment variables and Blob storage." });
  }
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const expected = process.env.FREELANCE_PASSWORD;
  const crypto = require("node:crypto");
  const a = crypto.createHash("sha256").update(password).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  if (!crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: "Incorrect password. Please try again." });
  const s = await session(req, res);
  s.authenticated = true;
  await s.save();
  return res.status(200).json({ ok: true });
};
