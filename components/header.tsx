"use client";
import Link from "next/link";
import { Search, ShoppingCart, Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/?q=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push("/");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, router]);

  return (
    <section className="sticky top-0 z-50 py-3 px-50 backdrop-blur-[5rem] border-b-1 border-[rgba(255,255,255,0.2)]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="logo">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-black italic text-yellow-600 leading-5">
              Sasti Dukaan
            </span>
            <span className="text-sm font-light italic text-yellow-700">
              Sabki Dukaan
            </span>
          </Link>
        </div>

        <div className="searchbar">
          <div className="w-[30rem] relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 pr-10 rounded-full border text-white text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                onClick={() => setSearchQuery("")}
              >
                <X size={18} />
              </button>
            )}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              onClick={handleSearch}
            >
              <Search />
            </button>
          </div>
        </div>

        {/* right-side-btn */}
        <div className="flex items-center space-x-6">
          {/* Wishlist */}
          <button className="relative p-2 text-gray-700 hover:text-indigo-600">
            <Heart size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Cart */}
          <button className="relative p-2 text-gray-700 hover:text-indigo-600">
            <ShoppingCart size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              5
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Header;
