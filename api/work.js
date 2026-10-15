const { requireAuth, readItems, writeItems } = require("./_lib");
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Cookie");
  if (!["GET", "PUT"].includes(req.method)) return res.status(405).json({ error: "Method not allowed" });
  try {
    const s = await requireAuth(req, res);
    if (!s) return res.status(401).json({ error: "Unauthorized" });
    if (req.method === "GET") return res.status(200).json(await readItems());
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: "Expected a list of work items." });
    if (items.length > 10000) return res.status(413).json({ error: "Too many work items." });
    for (const item of items) {
      if (!item || typeof item.id !== "string" || typeof item.title !== "string" || typeof item.client !== "string") {
        return res.status(400).json({ error: "Invalid work item data." });
      }
      if (!Number.isFinite(Number(item.amount)) || Number(item.amount) < 0 ||
          !Number.isFinite(Number(item.paid)) || Number(item.paid) < 0 ||
          Number(item.paid) > Number(item.amount)) {
        return res.status(400).json({ error: "Check project amounts and payments." });
      }
    }
    await writeItems(items);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Freelance Desk API error", e);
    return res.status(500).json({ error: "Cloud storage error. Check your private Blob store and environment variables." });
  }
};
