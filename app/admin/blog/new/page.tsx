import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogPostForm from "@/components/BlogPostForm";

const ADMIN_EMAIL = "rebecca.leung671@gmail.com";

export default async function NewBlogPostPage() {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/auth/login");
  return <BlogPostForm />;
}
