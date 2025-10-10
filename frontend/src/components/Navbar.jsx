import React, { useState, useEffect } from "react";
import { Search, Menu, X, PlusCircle, Heart, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/user.store.js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth(); // check if user is logged in on mount
  }, [checkAuth]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    // Navigate to landing page with search query
    if (location.pathname !== "/") {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      window.location.reload(); // refresh to trigger filtering
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left - Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-red-600 tracking-wide hover:text-red-700 transition"
        >
          Stayora
        </Link>

        {/* Center - Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-red-50 rounded-full px-4 py-2 w-[350px]"
        >
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-500"
          />
          <button
            type="submit"
            className="text-red-600 hover:text-red-700 transition"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/wishlist"
                className="flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:shadow-sm transition-all duration-300"
              >
                <Heart size={18} />
                Wishlist
              </Link>

              <Link
                to="/create-listing"
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover:shadow-md transition-all duration-300"
              >
                <PlusCircle size={18} />
                Create Listing
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 hover:shadow-sm transition-all duration-300"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 hover:shadow-sm transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-md transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-red-600 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <div className="flex items-center bg-red-50 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search destinations..."
                className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-500"
              />
              <button className="text-red-600 hover:text-red-700 transition">
                <Search size={20} />
              </button>
            </div>

            {user ? (
              <>
                <Link
                  to="/wishlist" // change the path
                  onClick={toggleMenu}
                  className="flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-lg text-center justify-center hover:bg-red-50 hover:shadow-sm transition-all duration-300"
                >
                  <Heart size={18} />
                  Wishlist
                </Link>

                <Link
                  to="/create-listing" //change the path
                  onClick={toggleMenu}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-center justify-center hover:bg-red-700 hover:shadow-md transition-all duration-300"
                >
                  <PlusCircle size={18} />
                  Create Listing
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-lg text-center justify-center hover:bg-red-50 hover:shadow-sm transition-all duration-300"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={toggleMenu}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-center hover:bg-red-50 hover:shadow-sm transition-all duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/auth"
                  onClick={toggleMenu}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-center hover:bg-red-700 hover:shadow-md transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
