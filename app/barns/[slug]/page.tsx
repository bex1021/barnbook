import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBarnBySlug, getAverageRating, getReviewsByBarn, isBarnSaved, getClaimByBarnAndUser, getNearbyBarns } from "@/lib/data";
import { auth } from "@/lib/auth";
import { Review } from "@/lib/types";
import BarnDetail from "@/components/BarnDetail";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const barn = await getBarnBySlug(slug);
  if (!barn) return { title: "Barn Not Found" };
  return {
    title: `${barn.name} - ${barn.address.city}, ${barn.address.state} | Barnbook`,
    description: barn.description.slice(0, 160),
  };
}

function computeCategoryAverages(reviews: Review[]) {
  const sums = { facilities: 0, trainer: 0, communication: 0, value: 0 };
  const counts = { facilities: 0, trainer: 0, communication: 0, value: 0 };
  for (const r of reviews) {
    if (!r.categoryRatings) continue;
    for (const key of ["facilities", "trainer", "communication", "value"] as const) {
      const val = r.categoryRatings[key];
      if (val) {
        sums[key] += val;
        counts[key]++;
      }
    }
  }
  return {
    facilities: counts.facilities > 0 ? Math.round((sums.facilities / counts.facilities) * 10) / 10 : null,
    trainer: counts.trainer > 0 ? Math.round((sums.trainer / counts.trainer) * 10) / 10 : null,
    communication: counts.communication > 0 ? Math.round((sums.communication / counts.communication) * 10) / 10 : null,
    value: counts.value > 0 ? Math.round((sums.value / counts.value) * 10) / 10 : null,
  };
}

export default async function BarnDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const barn = await getBarnBySlug(slug);
  if (!barn) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const [reviews, averageRating, savedStatus, existingClaim, nearbyBarns] = await Promise.all([
    getReviewsByBarn(barn.id),
    getAverageRating(barn.id),
    userId ? isBarnSaved(userId, barn.id) : Promise.resolve(false),
    userId && !barn.ownerId ? getClaimByBarnAndUser(barn.id, userId) : Promise.resolve(null),
    getNearbyBarns(barn.id, barn.address.state),
  ]);

  const claimStatus =
    barn.ownerId === userId ? "owner" :
    existingClaim ? "pending" :
    "none";

  const categoryAverages = computeCategoryAverages(reviews);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BarnDetail
        barn={barn}
        averageRating={averageRating}
        reviewCount={reviews.length}
        categoryAverages={categoryAverages}
        initialSaved={savedStatus}
        claimStatus={claimStatus}
        nearbyBarns={nearbyBarns}
      />

      {/* Reviews section */}
      <section className="mt-16 pt-10 border-t border-[#e8dcc8]">
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-1">Community</p>
          <h2
            className="text-2xl font-bold text-[#2c1810]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Reviews {reviews.length > 0 && (
              <span className="text-[#7a6a5a] font-normal text-xl">({reviews.length})</span>
            )}
          </h2>
        </div>

        <div className="mb-8">
          <ReviewForm barnId={barn.id} />
        </div>

        {reviews.length === 0 ? (
          <div className="bg-[#f0e8d8] border border-[#e8dcc8] rounded-2xl p-8 text-center">
            <p className="text-[#7a6a5a]">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
