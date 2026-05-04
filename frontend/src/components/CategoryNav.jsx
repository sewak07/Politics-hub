import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function CategoryNav() {
  const [open, setOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-6">

        {/* Top bar */}
        <div className="flex items-center justify-between h-14 md:h-auto">

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 overflow-x-auto">
            {categories.map((cat) => (
              <NavLink
                key={cat.value}
                to={cat.value === "all" ? "/" : `/category/${cat.value}`}
                className={({ isActive }) =>
                  `py-4 text-xs tracking-widest uppercase whitespace-nowrap transition
                  ${
                    isActive
                      ? "text-neutral-900 border-b-2 border-red-700 font-semibold"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-2xl text-neutral-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden flex flex-col gap-4 py-4 border-t border-neutral-200">
            {categories.map((cat) => (
              <NavLink
                key={cat.value}
                to={cat.value === "all" ? "/" : `/category/${cat.value}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-xs tracking-widest uppercase transition
                  ${
                    isActive
                      ? "text-red-700 font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </div>
        )}

      </div>
    </nav>
  );
}