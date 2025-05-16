import { FC } from "react";
import PostCard from "./_components/PostCard";
import Image from "next/image";

async function fetchData() {
  const postsResponse = await fetch(
    `${process.env.API_ENDPOINT}/posts?populate=%2A&pagination[limit]=3&sort[1]=updatedAt%3Adesc`,
  );
  const posts = await postsResponse.json().then((data) => data.data);

  return {
    posts,
  };
}

const Home: FC = async () => {
  const { posts } = await fetchData();

  return (
    <>
      <section id="welcome" className="flex items-center mb-16">
        <Image
          className="rounded-full p-2 bg-red-200"
          src="/bomberman.png"
          alt="bomberman"
          width={128}
          height={128}
        />
        <div className="ml-4 lg:ml-6">
          <span className="text-2xl text-gray-800 mb-2">Welcome friend!</span>
          <p>
            Read my blog if you are interested in JavaScript, React, or Frontend
            Development in general. <br />
            You can also learn more about me, the projects I work on, or contact
            me directly.
          </p>
        </div>
      </section>
      <section id="blog" className="mb-16">
        <h1 className="text-2xl font-bold text-gray-800">Latest Posts</h1>
        {posts.map((post: Post, idx: number) => (
          <PostCard
            key={post.id}
            post={post}
            isLastPost={idx === posts.length - 1}
          />
        ))}
      </section>
    </>
  );
};

export default Home;
