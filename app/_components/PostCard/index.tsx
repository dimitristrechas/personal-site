import React, { FC } from "react";
import Link from "next/link";

type InputProps = {
  post: Post;
  isLastPost: boolean;
};

const PostCard: FC<InputProps> = ({ post, isLastPost }: InputProps) => {
  return (
    <Link key={post.id} href={`/blog/${post.slug}`} prefetch={true}>
      <div className={`${isLastPost ? "" : "border-b-1"} py-4 cursor-pointer`}>
        <div className="text-xl text-gray-800 mb-1">{post.title}</div>
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
                    className="text-sm py-1 px-2 mr-2 text-white rounded"
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
