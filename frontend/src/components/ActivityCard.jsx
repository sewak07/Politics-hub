export default function ActivityCard({ name, count, label = "Posts" }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
      <p className="text-blue-400 font-medium">{name}</p>

      <p className="text-slate-300 text-sm mt-2">
        {label}:{" "}
        <span className="text-green-400 font-semibold">{count}</span>
      </p>
    </div>
  );
}