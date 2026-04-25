import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/?search=${search}`);
    }
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };

    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-[#faf7f2] border-b border-neutral-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* LOGO */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-[42px] leading-none font-extrabold tracking-tight">
            Politics<span className="text-red-700">Hub</span>
          </h1>

          <p className="text-[9px] sm:text-[10px] tracking-[0.25em] text-neutral-600 mt-1 sm:mt-2 uppercase">
            Independent Political Coverage
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">

          {/* SEARCH */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <SearchBar
                placeholder="Search articles..."
                onSearch={(value) => setSearch(value)}
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium 
              text-red-700 border border-red-700 
              hover:bg-red-700 hover:text-white 
              transition rounded-md whitespace-nowrap"
            >
              Search
            </button>
          </div>

          {/* AUTH */}
          {!user ? (

            <div className="flex justify-end sm:justify-start w-full sm:w-auto">
              <button
                onClick={() => navigate("/login")}
                className="w-auto inline-flex items-center px-4 py-2 text-sm font-semibold 
               text-red-700 border border-red-700 
               hover:bg-red-700 hover:text-white 
               transition rounded-md"
              >
                Sign in
              </button>
            </div>
            
          ) : (
            <div className="relative w-full sm:w-auto">

              {/* USER BUTTON */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                }}
                className="flex items-center justify-between sm:justify-start gap-3 px-3 py-2 cursor-pointer border sm:border-0 rounded-md sm:rounded-none"
              >
                {/* PROFILE ICON */}
                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* USER INFO */}
                <div className="flex flex-col leading-tight flex-1 sm:flex-none">
                  <span className="text-sm font-medium text-neutral-900 truncate">
                    {user.username}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Reader
                  </span>
                </div>

                {/* ARROW */}
                <svg
                  className="w-4 h-4 text-neutral-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* DROPDOWN */}
              <div
                className={`absolute right-0 mt-2 w-full sm:w-44 bg-white shadow-lg 
                rounded-md overflow-hidden transition-all duration-200 z-50
                ${dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <button
                  onClick={() => navigate("/liked-posts")}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Liked Posts
                </button>

                <div className="h-px bg-neutral-100" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </header>
  );
}