import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBarnById } from "@/lib/data";
import BarnForm from "@/components/BarnForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBarnPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { id } = await params;
  const barn = getBarnById(id);
  if (!barn) notFound();

  if (barn.ownerId !== session.user.id) redirect("/dashboard");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Listing</h1>
      <BarnForm mode="edit" barn={barn} />
    </div>
  );
}
