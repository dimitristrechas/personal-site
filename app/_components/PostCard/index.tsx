import Link from "next/link";
import type { FC } from "react";

type InputProps = {
  post: Post;
  isLastPost: boolean;
};

const PostCard: FC<InputProps> = ({ post, isLastPost }: InputProps) => {
  return (
    <Link key={post.id} href={`/blog/${post.slug}`} prefetch={true}>
      <div className={`${isLastPost ? "" : "border-b-1"} cursor-pointer py-4`}>
        <div className="mb-1 text-gray-800 text-xl">{post.title}</div>
        <div className="text-sm">
          {new Intl.DateTimeFormat(
            Intl.DateTimeFormat().resolvedOptions().locale,
            {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          ).format(new Date(post.createdAt))}
        </div>
        <div className="mt-2">
          {post.tags?.length > 0
            ? post.tags.map((tag) => {
                return (
                  <span
                    key={tag.id}
                    className="mr-2 rounded px-2 py-1 text-sm text-white"
                    style={{ backgroundColor: tag.color }}
                  >
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
