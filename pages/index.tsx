import { GetStaticProps } from "next";
import Link from "next/link";
import { FC, Fragment, useEffect, useState } from "react";
import matter from "gray-matter";
import { marked } from "marked";
import PostCard from "../components/Post/PostCard";

export const getStaticProps: GetStaticProps = async () => {
  const postsResponse = await fetch(
    `${process.env.API_ENDPOINT}/posts?populate=%2A&pagination[limit]=3&sort[1]=updatedAt%3Adesc`
  );
  const contactResponse = await fetch(`${process.env.API_ENDPOINT}/contact`);
  const aboutResponse = await fetch(`${process.env.API_ENDPOINT}/about`);

  const posts: Post[] = await postsResponse.json().then((data) => {
    return data.data;
  });

  const contactData: ContactPage = await contactResponse.json();
  const contactParsedMarkdown = matter(contactData.data);
  const contactHtmlString = marked.parse(contactParsedMarkdown.content);

  const aboutData: AboutPage = await aboutResponse.json();
  const aboutParsedMarkdown = matter(aboutData.data);
  const aboutHtmlString = marked.parse(aboutParsedMarkdown.content);

  return {
    props: {
      posts,
      contact: { contactHtmlString, contactData },
      about: { aboutHtmlString, aboutData },
    },
  };
};

type InputProps = {
  posts: Post[];
  contact: { contactHtmlString: string; contactData: ContactPage };
  about: { aboutHtmlString: string; aboutData: AboutPage };
};

const Home: FC<InputProps> = ({ posts, contact, about }: InputProps) => {
  const [postsList, setPostsList] = useState([] as Post[]);

  useEffect(() => {
    if (posts.length) {
      setPostsList(posts);
    }
  }, [posts]);

  return (
    <>
      <section>
        <div className="mb-20 flex items-center">
          <img
            className="rounded-full p-2 bg-red-200 h-32 lg:h-40"
            src="/bomberman.png"
            alt="bomberman"
          />
          <div className="ml-4">
            <h4 className="text-2xl text-gray-800 mb-2">Welcome friend!</h4>
            <p>
              Read my blog if you are interested in JavaScript, React or
              Frontend Development in general. <br></br>
              You can also learn more about me, the projects I work on or
              contact me directly.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-800">Latest Posts</h2>
          {postsList.map((post, idx) => {
            return (
              <Fragment key={post.id}>
                <PostCard
                  post={post}
                  isLastPost={idx === postsList.length - 1}
                />
              </Fragment>
            );
          })}
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
