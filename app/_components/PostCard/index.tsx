import Link from "next/link";
import type { FC } from "react";
import type { Post } from "@/types/post";

type InputProps = {
  post: Post;
  isLastPost: boolean;
};

const PostCard: FC<InputProps> = ({ post, isLastPost }: InputProps) => {
  const lastPostClass = isLastPost ? "" : "border-border border-b";

  return (
    <Link
      key={post.id}
      href={`/blog/${post.slug}`}
      prefetch={true}
      className="group"
      aria-label={`Read blog post: ${post.title}`}
    >
      <div
        className={`${lastPostClass} cursor-pointer rounded py-4 transition-colors group-hover:bg-muted group-focus-visible:bg-muted`}
      >
        <div className="mb-1 text-xl">{post.title}</div>
        <div className="text-muted-foreground text-sm">
          {new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }).format(new Date(post.createdAt))}
        </div>
        <div className="mt-2">
          {post.tags?.length > 0
            ? post.tags.map((tag) => {
                return (
                  <span key={tag.id} className="mr-4 inline-flex items-center gap-1 text-sm">
                    <span className="mt-0.5 size-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.title}
                  </span>
                );
              })
            : null}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
