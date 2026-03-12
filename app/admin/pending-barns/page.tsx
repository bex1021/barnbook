import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/is-admin";
import { redirect } from "next/navigation";
import { getPendingBarns } from "@/lib/data";
import Link from "next/link";


export const metadata = { title: "Pending Barns | Admin" };

export default async function PendingBarnsPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/auth/login");

  const barns = await getPendingBarns();

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-sm text-[#4a6741] hover:underline">
              ← Admin Dashboard
            </Link>
            <h1
              className="text-3xl font-bold text-[#2c1810] mt-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pending Barns
            </h1>
            <p className="text-[#6b5c4e] mt-1">
              {barns.length === 0
                ? "No barns awaiting review."
                : `${barns.length} barn${barns.length === 1 ? "" : "s"} awaiting review`}
            </p>
          </div>
        </div>

        {barns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm p-12 text-center">
            <p className="text-[#9b8575]">All caught up! No pending barns.</p>
            <p className="text-sm text-[#9b8575] mt-2">
              Run the scraper to find new barns:{" "}
              <code className="bg-[#f0e8d8] px-2 py-0.5 rounded text-xs">
                npx tsx --env-file=.env.local scripts/scrape-la-barns.ts
              </code>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {barns.map((barn) => (
              <div
                key={barn.id}
                className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Name + location */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2
                          className="text-lg font-bold text-[#2c1810]"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {barn.name}
                        </h2>
                        {barn.address?.city && (
                          <span className="text-sm text-[#9b8575]">
                            {barn.address.city}, {barn.address.state}
                          </span>
                        )}
                      </div>

                      {/* Website */}
                      {barn.website && (
                        <a
                          href={barn.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#4a6741] hover:underline mt-1 block truncate"
                        >
                          {barn.website}
                        </a>
                      )}

                      {/* Description */}
                      {barn.description && (
                        <p className="text-sm text-[#5a4a3a] mt-2 leading-relaxed">
                          {barn.description}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-xs text-[#7a6a5a]">
                        {/* Disciplines */}
                        {barn.disciplines.length > 0 && (
                          <span>
                            <span className="font-semibold text-[#2c1810]">Disciplines: </span>
                            {barn.disciplines.join(", ")}
                          </span>
                        )}
                        {/* Boarding */}
                        {barn.boarding?.types?.length > 0 && (
                          <span>
                            <span className="font-semibold text-[#2c1810]">Boarding: </span>
                            {barn.boarding.types.join(", ")}
                          </span>
                        )}
                        {/* Pricing */}
                        {barn.pricing?.boardingFrom > 0 && (
                          <span>
                            <span className="font-semibold text-[#2c1810]">Board from: </span>
                            ${barn.pricing.boardingFrom}/mo
                          </span>
                        )}
                        {barn.pricing?.lessonsFrom > 0 && (
                          <span>
                            <span className="font-semibold text-[#2c1810]">Lessons from: </span>
                            ${barn.pricing.lessonsFrom}
                          </span>
                        )}
                        {/* Leasing */}
                        {barn.horseLeasing && (
                          <span className="text-[#4a6741] font-semibold">Horse leasing ✓</span>
                        )}
                      </div>

                      {/* Trainers */}
                      {barn.trainers.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-[#2c1810]">Trainers: </span>
                          <span className="text-xs text-[#7a6a5a]">
                            {barn.trainers.map((t) => t.name).join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Contact */}
                      <div className="flex gap-4 mt-2 text-xs text-[#9b8575]">
                        {barn.phone && <span>📞 {barn.phone}</span>}
                        {barn.email && <span>✉ {barn.email}</span>}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <form action={`/api/admin/barns/${barn.id}/approve`} method="POST">
                        <button
                          type="submit"
                          className="w-full px-5 py-2 bg-[#4a6741] text-white text-sm font-semibold rounded-lg hover:bg-[#3a5535] transition-colors"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={`/api/admin/barns/${barn.id}/delete`} method="POST">
                        <button
                          type="submit"
                          className="w-full px-5 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
