import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSavedBarns } from "@/lib/data";
import SaveButton from "@/components/SaveButton";

export const metadata = {
  title: "Saved Barns | Barnbook",
};

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const barns = await getSavedBarns(session.user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Your Collection</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#2c1810]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Saved Barns
        </h1>
      </div>

      {barns.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-[#f0e8d8] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#c4956a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-[#7a6a5a] mb-5">You haven&apos;t saved any barns yet.</p>
          <Link
            href="/barns"
            className="text-sm text-[#4a6741] underline underline-offset-4 hover:text-[#2d5016] transition"
          >
            Browse barns to get started →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#7a6a5a] mb-8">{barns.length} saved barn{barns.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {barns.map((barn) => (
              <div key={barn.id} className="relative">
                <Link
                  href={`/barns/${barn.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#e8dcc8]"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#f0e8d8]">
                    {barn.photos[0] && (
                      <Image
                        src={`/images/barns/${barn.photos[0]}`}
                        alt={barn.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <SaveButton barnId={barn.id} initialSaved={true} />
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-semibold text-[#2c1810]"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {barn.name}
                    </h3>
                    <p className="text-xs text-[#7a6a5a] mt-1">
                      {barn.address.city}, {barn.address.state}
                    </p>
                    {barn.disciplines.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {barn.disciplines.slice(0, 2).map((d) => (
                          <span
                            key={d}
                            className="text-xs px-2.5 py-1 bg-[#f0e8d8] text-[#8b5e3c] rounded-full capitalize"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
