import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/is-admin";
import { redirect } from "next/navigation";
import BlogPostForm from "@/components/BlogPostForm";


export default async function NewBlogPostPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/auth/login");
  return <BlogPostForm />;
}
