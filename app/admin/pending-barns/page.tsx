import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/is-admin";
import { redirect } from "next/navigation";
import { getPendingBarns, getArchivedBarns } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Barn } from "@/lib/types";


export const metadata = { title: "Pending Barns | Admin" };

function BarnRow({ barn, actions }: { barn: Barn; actions: React.ReactNode }) {
  const firstPhoto = barn.photos?.[0];
  const screenshotUrl = barn.website
    ? `https://image.thum.io/get/width/400/${barn.website}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm overflow-hidden">
      <div className="flex">
        {/* Left visual column */}
        <div className="flex-shrink-0 flex flex-col w-40 lg:w-52 border-r border-[#e8dcc8]">
          {/* Barn photo */}
          <div className="relative w-full bg-[#f0e8d8]" style={{ aspectRatio: "4/3" }}>
            {firstPhoto ? (
              <Image
                src={`/images/barns/${firstPhoto}`}
                alt={barn.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 160px, 208px"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#c4b09a]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 12V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5V12z" />
                </svg>
                <span className="text-xs">No photo</span>
              </div>
            )}
          </div>

          {/* Website screenshot */}
          {screenshotUrl && (
            <div className="relative w-full border-t border-[#e8dcc8]" style={{ aspectRatio: "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotUrl}
                alt={`${barn.name} website preview`}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent px-2 py-1">
                <span className="text-white text-[10px] font-medium">Website preview</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: info + actions */}
        <div className="flex-1 p-5 flex gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            {/* Name + location */}
            <div className="flex items-baseline gap-2 flex-wrap">
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

            {/* Website link */}
            {barn.website && (
              <a
                href={barn.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#4a6741] hover:underline mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                View Website
              </a>
            )}

            {/* Description */}
            {barn.description && (
              <p className="text-sm text-[#5a4a3a] mt-2 leading-relaxed line-clamp-3">
                {barn.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-[#7a6a5a]">
              {barn.disciplines.length > 0 && (
                <span>
                  <span className="font-semibold text-[#2c1810]">Disciplines: </span>
                  {barn.disciplines.join(", ")}
                </span>
              )}
              {barn.boarding?.types?.length > 0 && (
                <span>
                  <span className="font-semibold text-[#2c1810]">Boarding: </span>
                  {barn.boarding.types.join(", ")}
                </span>
              )}
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
              {barn.horseLeasing && (
                <span className="text-[#4a6741] font-semibold">Horse leasing ✓</span>
              )}
            </div>

            {/* Services */}
            {(barn.services || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(barn.services || []).map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 bg-[#f0e8d8] text-[#5a4a3a] rounded-full capitalize">
                    {s}
                  </span>
                ))}
              </div>
            )}

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
          <div className="flex flex-col gap-2 flex-shrink-0 pt-0.5">
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function PendingBarnsPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/auth/login");

  const [barns, archivedBarns] = await Promise.all([
    getPendingBarns(),
    getArchivedBarns(),
  ]);

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
              <BarnRow
                key={barn.id}
                barn={barn}
                actions={
                  <>
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
                        Archive
                      </button>
                    </form>
                  </>
                }
              />
            ))}
          </div>
        )}

        {/* Archived section */}
        {archivedBarns.length > 0 && (
          <div className="mt-14">
            <h2
              className="text-xl font-bold text-[#2c1810] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Archived ({archivedBarns.length})
            </h2>
            <div className="space-y-4">
              {archivedBarns.map((barn) => (
                <BarnRow
                  key={barn.id}
                  barn={barn}
                  actions={
                    <form action={`/api/admin/barns/${barn.id}/restore`} method="POST">
                      <button
                        type="submit"
                        className="w-full px-5 py-2 bg-white text-[#4a6741] text-sm font-semibold rounded-lg border border-[#4a6741] hover:bg-[#f0f4ee] transition-colors"
                      >
                        Restore
                      </button>
                    </form>
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
