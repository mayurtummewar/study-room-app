"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [username, setUsername] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("username");
      if (u) setUsername(u);
    }
  }, []);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
  <Link href="/home" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">S</div>
          <div>
            <div className="text-lg font-semibold">SyncStudy</div>
            <div className="text-xs text-gray-500">Focus together</div>
          </div>
        </Link>

        {/* Hide navigation on login/signup pages */}
        {!(pathname === "/" || pathname === "/signup") && (
          <nav className="flex items-center gap-3">
            <Link href="/home" className="text-sm text-gray-700 hover:underline">
              Home
            </Link>
            <Link href="/profile" className="text-sm text-gray-700 hover:underline flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">{username ? username.slice(0,1).toUpperCase() : 'G'}</span>
              <span>{username || 'Guest'}</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
