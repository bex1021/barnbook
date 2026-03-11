import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#1a3009] text-green-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="hover:opacity-80 transition-opacity inline-block mb-3">
              <Logo variant="light" />
            </Link>
            <p className="text-sm text-green-200">
              The premier directory for finding horse farms and barns across the country.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/barns" className="hover:text-white transition">Browse Barns</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Barnblog</Link></li>
              <li><Link href="/for-riders" className="hover:text-white transition">For Riders</Link></li>
              <li><Link href="/for-owners" className="hover:text-white transition">For Barn Owners</Link></li>
              <li><Link href="/claim" className="hover:text-white transition">Claim Your Listing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Disciplines</h4>
            <ul className="space-y-2 text-sm">
              <li>Dressage</li>
              <li>Jumping</li>
              <li>Western</li>
              <li>Eventing</li>
              <li>Trail Riding</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-6 text-center text-sm text-green-300">
          &copy; {new Date().getFullYear()} Barnbook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
