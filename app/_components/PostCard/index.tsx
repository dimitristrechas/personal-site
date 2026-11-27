import Link from "next/link";
import type { FC } from "react";
import { isSeriesTagSlug } from "@/lib/series-tags";
import type { Post } from "@/types/post";
import { formatDate } from "@/utils/helpers";

type PostCardProps = {
  post: Post;
  isLastPost: boolean;
};

const PostCard: FC<PostCardProps> = ({ post, isLastPost }) => {
  const lastPostClass = isLastPost ? "" : "border-border border-b";
  // Internal tags (`visibility !== "public"`) are never for display; series tags are navigation, not labels.
  const displayTags = post.tags.filter((tag) => tag.visibility === "public" && !isSeriesTagSlug(tag.slug));

  return (
    <Link href={`/blog/${post.slug}`} prefetch={true} className="group" aria-label={`Read blog post: ${post.title}`}>
      <div
        className={`${lastPostClass} group-hover:bg-muted group-focus-visible:bg-muted cursor-pointer rounded py-4 transition-colors`}
      >
        <div className="mb-1 text-xl">{post.title}</div>
        <div className="text-muted-foreground text-sm">{formatDate(post.publishedAt)}</div>
        <div className="mt-2">
          {displayTags.map((tag) => (
            <span key={tag.id} className="mr-4 inline-flex items-center gap-1 text-sm">
              {tag.color && <span className="mt-0.5 size-2.5 rounded-full" style={{ backgroundColor: tag.color }} />}
              {tag.title}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
