import { FC, Fragment } from "react";
import matter from "gray-matter";
import { marked } from "marked";
import PostCard from "./_components/PostCard";
import Image from "next/image";

async function fetchData() {
  const postsResponse = await fetch(
    `${process.env.API_ENDPOINT}/posts?populate=%2A&pagination[limit]=3&sort[1]=updatedAt%3Adesc`
  );
  const contactResponse = await fetch(`${process.env.API_ENDPOINT}/contact`);
  const aboutResponse = await fetch(`${process.env.API_ENDPOINT}/about`);

  const posts = await postsResponse.json().then((data) => data.data);
  const contactData = await contactResponse.json();
  const contactParsedMarkdown = matter(contactData.data);
  const contactHtmlString = marked.parse(contactParsedMarkdown.content);

  const aboutData = await aboutResponse.json();
  const aboutParsedMarkdown = matter(aboutData.data);
  const aboutHtmlString = marked.parse(aboutParsedMarkdown.content);

  return {
    posts,
    contact: { contactHtmlString, contactData },
    about: { aboutHtmlString, aboutData },
  };
}

const Home: FC = async () => {
  const { posts, contact, about } = await fetchData();

  return (
    <>
      <section>
        <div className="mb-20 flex items-center">
          <Image
            className="rounded-full p-2 bg-red-200"
            src="/bomberman.png"
            alt="bomberman"
            width={128}
            height={128}
          />
          <div className="ml-4">
            <h4 className="text-2xl text-gray-800 mb-2">Welcome friend!</h4>
            <p>
              Read my blog if you are interested in JavaScript, React, or
              Frontend Development in general. <br />
              You can also learn more about me, the projects I work on, or
              contact me directly.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-800">Latest Posts</h2>
          {posts.map((post: Post, idx: number) => (
            <Fragment key={post.id}>
              <PostCard post={post} isLastPost={idx === posts.length - 1} />
            </Fragment>
          ))}
        </div>
      </section>
      <section>
        <article
          id="about"
          className="prose mb-20 pt-4"
          dangerouslySetInnerHTML={{ __html: about.aboutHtmlString }}
        />
      </section>
      <section>
        <article
          id="contact"
          className="prose mb-20 pt-4"
          dangerouslySetInnerHTML={{ __html: contact.contactHtmlString }}
        />
      </section>
    </>
  );
};

export default Home;
