import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBarnBySlug, getAverageRating, getReviewsByBarn } from "@/lib/data";
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

export default async function BarnDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const barn = await getBarnBySlug(slug);
  if (!barn) notFound();

  const [reviews, averageRating] = await Promise.all([
    getReviewsByBarn(barn.id),
    getAverageRating(barn.id),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BarnDetail barn={barn} averageRating={averageRating} reviewCount={reviews.length} />

      {/* Reviews section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal">({reviews.length})</span>}
        </h2>

        <div className="mb-8">
          <ReviewForm barnId={barn.id} />
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this barn!</p>
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
