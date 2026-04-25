export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-6 mt-6">
      <div className="bg-red-100 border-l-4 border-red-700 px-4 py-3 text-sm text-red-800">
        {message}
      </div>
    </div>
  );
}