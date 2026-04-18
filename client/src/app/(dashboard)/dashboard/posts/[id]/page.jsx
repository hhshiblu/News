import { notFound } from "next/navigation";
import { getAdminPostByIdAction } from "@/actions/admin-data.action";
import DashboardArticlePreview from "@/components/dashboard/articles/DashboardArticlePreview";

export default async function PreviewPostPage({ params }) {
  const { id } = await params;
  const post = await getAdminPostByIdAction(id);
  if (!post) return notFound();
  return <DashboardArticlePreview post={post} />;
}
