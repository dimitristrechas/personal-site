import Image from "next/image";
import type { FC } from "react";
import PostCard from "./_components/PostCard";

async function fetchData() {
  const postsResponse = await fetch(
    `${process.env.API_ENDPOINT}/posts?populate=%2A&pagination[limit]=5&sort[1]=createdAt%3Adesc`,
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
      <section id="welcome" className="mb-16 flex items-center">
        <Image
          className="rounded-full bg-red-200 object-cover p-0.25"
          src="/headshot-compressed.jpg"
          alt="a headshot of the author"
          width={128}
          height={128}
          style={{ width: "128px", height: "128px" }}
        />
        <div className="ml-4 lg:ml-6">
          <span className="mb-2 text-2xl text-gray-800">Welcome friend!</span>
          <p>
            Read my blog if you are interested in JavaScript, React, or Frontend
            Development in general. <br />
            You can also learn more about me, the projects I work on, or contact
            me directly.
          </p>
        </div>
      </section>
      <section id="blog" className="mb-16">
        <h1 className="font-bold text-2xl text-gray-800">Latest Posts</h1>
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
