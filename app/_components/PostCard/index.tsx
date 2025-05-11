import React, { FC } from "react";
import Link from "next/link";

type InputProps = {
  post: Post;
  isLastPost: Boolean;
};

const PostCard: FC<InputProps> = ({ post, isLastPost }: InputProps) => {
  console.log('post', post);

  return (
    <Link key={post.id} href={"/blog/" + post.slug}>
      <div className={`${isLastPost ? "" : "border-b-1"} py-4 cursor-pointer`}>
        <div className="text-xl text-gray-800">{post.title}</div>
        <div className="text-sm">
          {new Date(post.updatedAt).toLocaleString("el-GR")}
        </div>
        <div className="mt-2">
          {post.tags?.length > 0
            ? post.tags.map((tag) => {
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className="text-sm py-1 px-2 mr-2 text-white rounded"
                    style={{ backgroundColor: tag.color }}
                    disabled
                  >
                    {tag.title}
                  </button>
                );
              })
            : null}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
