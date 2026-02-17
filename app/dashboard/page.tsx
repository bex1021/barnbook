import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getBarnsByOwner, getAverageRating, getReviewsByBarn } from "@/lib/data";
import StarRating from "@/components/StarRating";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const barns = getBarnsByOwner(session.user.id!);

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

      {barns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h2>
          <p className="text-gray-500 mb-6">Create your first barn listing to get started.</p>
          <Link
            href="/dashboard/new"
            className="inline-block bg-[#2d5016] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#4a7c28] transition"
          >
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {barns.map((barn) => {
            const avg = getAverageRating(barn.id);
            const reviewCount = getReviewsByBarn(barn.id).length;
            return (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
