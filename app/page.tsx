import Image from "next/image";
import type { FC } from "react";
import { getHomepageData } from "@/lib/series";
import type { Post } from "@/types/post";
import type { Series } from "@/types/series";
import PostCard from "./_components/PostCard";
import SeriesCard from "./_components/SeriesCard";

export const revalidate = 3600;

const Home: FC = async () => {
  const { posts, seriesList }: { posts: Post[]; seriesList: Series[] } = await getHomepageData(3);

  return (
    <>
      <section id="welcome" className="mb-16 flex items-center">
        <Image
          className="rounded-full bg-red-200 object-cover p-px"
          src="/headshot-compressed.jpg"
          alt="a headshot of the author"
          width={128}
          height={128}
          style={{ width: "128px", height: "128px" }}
          priority
        />
        <div className="ml-4 lg:ml-6">
          <h1 className="mb-2 text-2xl">Welcome friend!</h1>
          <p>
            Read my blog if you are interested in JavaScript, React, or Frontend Development in general. <br />
            You can also learn more about me, the projects I work on, or contact me directly.
          </p>
        </div>
      </section>
      <section id="blog" className="mb-16">
        <h2 className="font-bold text-2xl">Latest Posts</h2>
        {posts.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Posts temporarily unavailable. Please try again later.</p>
        ) : (
          posts.map((post: Post, idx: number) => (
            <PostCard key={post.id} post={post} isLastPost={idx === posts.length - 1} />
          ))
        )}
      </section>
      {seriesList.length > 0 ? (
        <section id="series" className="mb-16">
          <h2 className="font-bold text-2xl">Article Series</h2>
          {seriesList.map((series, idx) => (
            <SeriesCard key={series.id} series={series} isLastSeries={idx === seriesList.length - 1} />
          ))}
        </section>
      ) : null}
    </>
  );
};

export default Home;
