"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"; // signOut used in mobile menu
import Logo from "./Logo";
import NavUserDropdown from "./NavUserDropdown";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const name = session?.user?.name;

  return (
    <nav className="bg-[#faf7f2] border-b border-[#e8dcc8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            <Link href="/for-riders" className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide">
              For Riders
            </Link>
            <Link href="/for-owners" className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide">
              For Owners
            </Link>
            <Link href="/barns" className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide">
              Browse Barns
            </Link>
            <Link href="/blog" className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide">
              Journal
            </Link>

            {session ? (
              <>
                {role === "admin" && (
                  <Link href="/admin" className="text-sm text-[#5a4a3a] hover:text-[#2c1810] transition tracking-wide">
                    Admin
                  </Link>
                )}
                <NavUserDropdown name={name ?? "Account"} role={role ?? "rider"} />
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-sm bg-[#4a6741] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#3a5535] transition tracking-wide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
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
          <Link href="/for-riders" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>For Riders</Link>
          <Link href="/for-owners" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>For Owners</Link>
          <Link href="/barns" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>Browse Barns</Link>
          <Link href="/blog" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>Barnblog</Link>
          {session ? (
            <>
              {role === "admin" && (
                <Link href="/admin" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>Admin</Link>
              )}
              <div className="border-t border-[#e8dcc8] pt-3 mt-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${role === "admin" ? "bg-[#6b3fa0] text-white" : role === "owner" ? "bg-[#8b5e3c] text-white" : "bg-[#4a6741] text-white"}`}>
                    {(name ?? "A").trim().split(" ").filter(Boolean).map((p: string) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-[#2c1810]">{name ?? "Account"}</span>
                </div>
                <Link href="/profile" className="block pl-9 text-sm text-[#5a4a3a] hover:text-[#2c1810] py-1" onClick={() => setMobileOpen(false)}>Profile</Link>
                <Link href="/account/preferences" className="block pl-9 text-sm text-[#5a4a3a] hover:text-[#2c1810] py-1" onClick={() => setMobileOpen(false)}>Account Preferences</Link>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block pl-9 text-sm text-red-600 hover:text-red-700 py-1 w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link href="/auth/login" className="block text-[#5a4a3a] hover:text-[#2c1810]" onClick={() => setMobileOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
