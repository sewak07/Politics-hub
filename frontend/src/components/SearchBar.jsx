import { useState } from "react";

export default function SearchBar({ placeholder = "Search articles...", onSearch }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    onSearch(val);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-64 px-4 py-2 text-sm bg-transparent 
                   border border-neutral-300 
                   rounded-md
                   text-neutral-800
                   placeholder:text-neutral-400
                   focus:outline-none focus:border-red-700 
                   focus:ring-1 focus:ring-red-200
                   transition"
      />
    </div>
  );
}