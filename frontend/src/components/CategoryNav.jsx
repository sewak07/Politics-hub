import { NavLink } from "react-router-dom";

export default function CategoryNav() {
  const categories = [
    { label: "All", value: "all" },
    { label: "National", value: "national" },
    { label: "International", value: "international" },
    { label: "Economy", value: "economy" },
    { label: "Election", value: "election" },
    { label: "Opinion", value: "opinion" },
    { label: "Other", value: "other" },
  ];

  return (
    <nav className="bg-[#faf7f2] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto">

        {categories.map((cat) => (
          <NavLink
            key={cat.value}
            to={cat.value === "all" ? "/" : `/category/${cat.value}`}
            className={({ isActive }) =>
              `py-4 text-xs tracking-widest uppercase whitespace-nowrap transition
              ${isActive
                ? "text-neutral-900 border-b-2 border-red-700 font-semibold"
                : "text-neutral-500 hover:text-neutral-900"
              }`
            }
          >
            {cat.label}
          </NavLink>
        ))}

      </div>
    </nav>
  );
}