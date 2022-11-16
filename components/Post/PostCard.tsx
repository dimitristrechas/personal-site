import React, { FC } from "react";
import Link from "next/link";

type InputProps = {
  post: Post;
  isLastPost: Boolean;
};

const PostCard: FC<InputProps> = ({ post, isLastPost }: InputProps) => {
  return (
    <Link key={post.id} href={"/blog/" + post.attributes.slug}>
      <div className={`${isLastPost ? "" : "border-b-2"} py-4 cursor-pointer`}>
        <div className="text-xl text-gray-800">{post.attributes.title}</div>
        <div className="text-sm">{new Date(post.attributes.updatedAt).toLocaleString("el-GR")}</div>
        <div className="mt-2">
          {post.attributes.tags?.data.length > 0
            ? post.attributes.tags.data.map((tag) => {
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className="text-sm py-1 px-2 mr-2 text-white rounded"
                    style={{ backgroundColor: tag.attributes.color }}
                    disabled
                  >
                    {tag.attributes.title}
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
