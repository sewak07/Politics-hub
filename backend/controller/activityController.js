import ActivityLog from "../model/ActivityLog.model.js";

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({})
      .populate("actor", "username role")
      .populate("post", "title category")
      .populate("targetUser", "username")
      .sort({ createdAt: -1 })
      .lean();

    // 🛡️ HARD SAFE FILTER (prevents dashboard crash)
    const safeLogs = logs
      .filter((log) => log && log.action && log.message)
      .map((log) => ({
        ...log,
        actor: log.actor || null,
        post: log.post || null,
        targetUser: log.targetUser || null,
      }));

    return res.json({ logs: safeLogs });
  } catch (err) {
    console.error("Activity fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};