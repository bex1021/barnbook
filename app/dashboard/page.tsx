import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getBarnsByOwner, getAverageRating, getReviewsByBarn } from "@/lib/data";
import StarRating from "@/components/StarRating";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const barns = await getBarnsByOwner(session.user.id!);

  const barnsWithStats = await Promise.all(
    barns.map(async (barn) => {
      const [avg, reviews] = await Promise.all([
        getAverageRating(barn.id),
        getReviewsByBarn(barn.id),
      ]);
      return { barn, avg, reviewCount: reviews.length };
    })
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {session.user.name}</p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-[#2d5016] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#4a7c28] transition"
        >
          + New Listing
        </Link>
      </div>

      {barnsWithStats.length === 0 ? (
        <div className="bg-white border border-[#e8dcc8] rounded-xl p-12 text-center">
          <h2 className="text-xl font-semibold text-[#2c1810] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            No listings yet
          </h2>
          <p className="text-[#7a6a5a] mb-8">Add your barn to Barnbook to reach riders in your area.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/claim"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-[#4a6741] text-[#4a6741] rounded-lg font-medium hover:bg-[#f0e8d8] transition"
            >
              Claim Existing Barn
            </Link>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#4a6741] text-white rounded-lg font-medium hover:bg-[#3a5535] transition"
            >
              Create New Listing
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {barnsWithStats.map(({ barn, avg, reviewCount }) => (
            <div key={barn.id} className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
              <div>
                <Link href={`/barns/${barn.slug}`} className="text-lg font-semibold text-gray-900 hover:text-[#2d5016]">
                  {barn.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {barn.address.city}, {barn.address.state}
                </p>
                {avg > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={Math.round(avg)} size="sm" />
                    <span className="text-sm text-gray-600">{avg} ({reviewCount})</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/edit/${barn.id}`}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Edit
                </Link>
                <Link
                  href={`/barns/${barn.slug}`}
                  className="px-4 py-2 text-sm text-[#2d5016] border border-[#2d5016] rounded-lg hover:bg-green-50 transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Messages placeholder */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-[#2c1810] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          Messages
        </h2>
        <div className="bg-white border border-[#e8dcc8] rounded-xl p-8 text-center">
          <p className="text-[#7a6a5a] text-sm">Messaging is coming soon — you&apos;ll be able to receive and respond to inquiries from riders here.</p>
        </div>
      </div>
    </div>
  );
}
