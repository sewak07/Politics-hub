import ActivityCard from "./ActivityCard";

export default function AdminActivity({
  logs,
  range,
  onSelectAdmin,
  selectedAdminId,
}) {
  const cutoff = (() => {
    const now = Date.now();
    const map = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "1m": 30 * 24 * 60 * 60 * 1000,
      "1y": 365 * 24 * 60 * 60 * 1000,
    };
    if (range === "all") return null;
    return new Date(now - (map[range] || map["24h"]));
  })();

  const grouped = logs
    .filter((log) => {
      if (!log?.actor?._id) return false;

      if (
        log.actor.role !== "admin" &&
        log.actor.role !== "superadmin"
      ) {
        return false;
      }

      if (cutoff && new Date(log.createdAt) < cutoff) return false;

      const isRealPost =
        log?.post &&
        !log.action?.toLowerCase().includes("like") &&
        !log.action?.toLowerCase().includes("view") &&
        !log.action?.toLowerCase().includes("comment");

      return isRealPost;
    })
    .reduce((acc, log) => {
      const id = log.actor._id;

      if (!acc[id]) {
        acc[id] = {
          id,
          name: log.actor.username || "Unknown",
          count: 0,
        };
      }

      acc[id].count += 1;
      return acc;
    }, {});

  const admins = Object.values(grouped);

  return (
    <div>
      <h2 className="text-sm text-slate-300 mb-4">
        Admin Activity
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {admins.map((a) => (
          <div
            key={a.id}
            onClick={() => onSelectAdmin(a.id)}
            className={`cursor-pointer ${
              selectedAdminId === a.id
                ? "ring-2 ring-blue-500 rounded-xl"
                : ""
            }`}
          >
            <ActivityCard
              name={a.name}
              count={a.count}
              label="Posts"
            />
          </div>
        ))}
      </div>
    </div>
  );
}