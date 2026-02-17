"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="bg-[#2d5016] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Barnbook
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/barns" className="hover:text-green-200 transition">
              Browse Barns
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="hover:text-green-200 transition">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-white/10 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-white text-[#2d5016] px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/barns" className="block py-2 hover:text-green-200" onClick={() => setMobileOpen(false)}>
              Browse Barns
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-green-200" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block py-2 hover:text-green-200 w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="block py-2 hover:text-green-200" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
