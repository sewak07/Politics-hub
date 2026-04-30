export default function TopBar() {
  return (
    <div className="bg-neutral-900 text-white text-[10px] sm:text-xs px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
      
      <span className="bg-red-700 px-2 sm:px-3 py-1 font-bold tracking-widest whitespace-nowrap">
        BREAKING
      </span>

      <span className="text-neutral-300 tracking-wide truncate max-w-[70%] sm:max-w-none">
        Live political updates • Verified sources only
      </span>

    </div>
  );
}