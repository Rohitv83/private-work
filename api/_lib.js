const { getIronSession } = require("iron-session");
const { get, put } = require("@vercel/blob");

const options = {
  password: process.env.SESSION_SECRET,
  cookieName: "freelance_desk_session",
  cookieOptions: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 }
};
async function session(req, res) {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters.");
  return getIronSession(req, res, options);
}
async function requireAuth(req, res) {
  const s = await session(req, res);
  if (s.authenticated !== true) return null;
  return s;
}
const blobPath = "freelance-desk/work-items.json";
async function readItems() {
  const result = await get(blobPath, { access: "private" });
  if (!result || result.statusCode !== 200) return [];
  const value = await new Response(result.stream).text();
  const data = JSON.parse(value);
  return Array.isArray(data) ? data : [];
}
async function writeItems(items) {
  await put(blobPath, JSON.stringify(items), {
    access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json"
  });
}
module.exports = { session, requireAuth, readItems, writeItems };
