import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import BarnForm from "@/components/BarnForm";

export default async function NewBarnPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Listing</h1>
      <BarnForm mode="create" />
    </div>
  );
}
