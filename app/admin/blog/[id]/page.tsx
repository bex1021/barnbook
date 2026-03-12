import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/is-admin";
import { getPostById } from "@/lib/blog";
import { redirect, notFound } from "next/navigation";
import BlogPostForm from "@/components/BlogPostForm";


export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/auth/login");

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return <BlogPostForm post={post} />;
}
