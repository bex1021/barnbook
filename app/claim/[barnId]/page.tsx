import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBarnById, getClaimByBarnAndUser } from "@/lib/data";
import ClaimForm from "@/components/ClaimForm";

interface PageProps {
  params: Promise<{ barnId: string }>;
}

export const metadata = {
  title: "Claim Listing | Barnbook",
};

export default async function ClaimFormPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const { barnId } = await params;
  const barn = await getBarnById(barnId);
  if (!barn) notFound();

  if (barn.verified) redirect(`/barns/${barn.slug}`);

  const existingClaim = await getClaimByBarnAndUser(barnId, session.user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Barn Owners</p>
        <h1
          className="text-3xl font-bold text-[#2c1810] mb-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Claim This Listing
        </h1>
        <p className="text-[#7a6a5a]">{barn.name} · {barn.address.city}, {barn.address.state}</p>
      </div>

      {existingClaim ? (
        <div className="bg-[#f0e8d8] border border-[#e8dcc8] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-[#e8dcc8] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#2c1810] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Claim Submitted
          </h2>
          <p className="text-[#7a6a5a] text-sm">
            Your claim for <strong>{barn.name}</strong> is under review. We&apos;ll be in touch once it&apos;s been verified.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-[#f0e8d8] border border-[#e8dcc8] rounded-xl p-4 mb-8 text-sm text-[#5a4a3a]">
            <p className="font-medium mb-1">How verification works</p>
            <p>Submit your contact details and a message verifying your ownership. We&apos;ll review your request and reach out to confirm before approving.</p>
          </div>
          <ClaimForm barnId={barnId} barnName={barn.name} />
        </>
      )}
    </div>
  );
}
