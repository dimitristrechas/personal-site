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

  console.log('aboutData', aboutData);
  console.log('contactData', contactData);


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
      <section id="welcome" className="mb-16">
        <div className="flex items-center">
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
              Read my blog if you are interested in JavaScript, React, or
              Frontend Development in general. <br />
              You can also learn more about me, the projects I work on, or
              contact me directly.
            </p>
          </div>
        </div>
      </section>
      <section id="blog" className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800">Latest Posts</h2>
        {posts.map((post: Post, idx: number) => (
          <PostCard key={post.id} post={post} isLastPost={idx === posts.length - 1} />
        ))}
      </section>
      <section id="about" className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800">{about.aboutData.data.title}</h2>
        <p
          className="prose pt-4"
          dangerouslySetInnerHTML={{ __html: about.aboutHtmlString }}
        />
      </section>
      <section id="contact" className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800">{contact.contactData.data.title}</h2>
        <p
          className="prose pt-4"
          dangerouslySetInnerHTML={{ __html: contact.contactHtmlString }}
        />
      </section>
    </>
  );
};

export default Home;
