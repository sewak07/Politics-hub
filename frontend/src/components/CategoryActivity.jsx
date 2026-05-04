import ActivityCard from "./ActivityCard";

export default function CategoryActivity({ logs, range }) {
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
      const isRealPost =
        log?.post?.category &&
        !log?.action?.toLowerCase().includes("like") &&
        !log?.action?.toLowerCase().includes("dislike") &&
        !log?.action?.toLowerCase().includes("view") &&
        !log?.action?.toLowerCase().includes("comment");

      if (!isRealPost) return false;

      // APPLY TIME FILTER
      if (cutoff && new Date(log.createdAt) < cutoff) {
        return false;
      }

      return true;
    })
    .reduce((acc, log) => {
      const category = log.post.category;

      if (!acc[category]) {
        acc[category] = {
          name: category,
          count: 0,
        };
      }

      acc[category].count += 1;

      return acc;
    }, {});

  const categories = Object.values(grouped);

  return (
    <div>
      <h2 className="text-sm text-slate-300 mb-4">
        Category Activity
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((c, i) => (
          <ActivityCard
            key={i}
            name={c.name}
            count={c.count}
            label="Posts"
          />
        ))}
      </div>
    </div>
  );
}