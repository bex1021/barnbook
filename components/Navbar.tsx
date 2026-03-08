"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="bg-[#faf7f2] border-b border-[#e8dcc8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-2xl tracking-tight text-[#2c1810]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Barnbook
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/barns"
              className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide"
            >
              Browse Barns
            </Link>

            {session && (
              <>
                <Link
                  href="/saved"
                  className="flex items-center gap-1.5 text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Saved
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition"
                >
                  Sign Out
                </button>
              </>
            )}

            {!session && (
              <Link
                href="/auth/login"
                className="text-sm bg-[#4a6741] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#3a5535] transition tracking-wide"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#2c1810]"
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#e8dcc8] px-4 py-4 space-y-3 bg-[#faf7f2]">
          <Link href="/barns" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>
            Browse Barns
          </Link>
          {session ? (
            <>
              <Link href="/saved" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>
                Saved Barns
              </Link>
              <Link href="/dashboard" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                className="block text-[#5a4a3a] hover:text-[#2c1810] w-full text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
