import { auth } from "@/lib/auth";
import { getPostById } from "@/lib/blog";
import { redirect, notFound } from "next/navigation";
import BlogPostForm from "@/components/BlogPostForm";

const ADMIN_EMAIL = "rebecca.leung671@gmail.com";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/auth/login");

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return <BlogPostForm post={post} />;
}
