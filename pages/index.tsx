import { GetStaticProps } from "next";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import matter from "gray-matter";
import marked from "marked";

export const getStaticProps: GetStaticProps = async () => {
  const postsResponse = await fetch(`${process.env.API_ENDPOINT}/posts?_sort=published_at:DESC&_limit=3`);
  const contactResponse = await fetch(`${process.env.API_ENDPOINT}/contact`);
  const aboutResponse = await fetch(`${process.env.API_ENDPOINT}/about`);

  const posts: Post[] = await postsResponse.json();

  const contactData: ContactPage = await contactResponse.json();
  const contactParsedMarkdown = matter(contactData.content);
  const contactHtmlString = marked(contactParsedMarkdown.content);

  const aboutData: AboutPage = await aboutResponse.json();
  const aboutParsedMarkdown = matter(aboutData.content);
  const aboutHtmlString = marked(aboutParsedMarkdown.content);

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
          <img className="rounded-full p-2 bg-red-200 h-32 lg:h-40" src="/bomberman.png" alt="bomberman" />
          <div className="ml-4">
            <h4 className="text-2xl text-gray-800 mb-2">Welcome friend!</h4>
            <p>
              Read my blog if you are interested in JavaScript, React or Frontend Development in general. <br></br>
              You can also learn more about me, the projects I work on or contact me directly.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-800">Latest Posts</h2>
          {postsList.map((post, key) => {
            return (
              <Link key={post._id} href="/blog/[slug]" as={"/blog/" + post.slug}>
                <div className={`${key === postsList.length - 1 ? "" : "border-b-2"} py-4 cursor-pointer`}>
                  <div className="text-xl text-gray-800">{post.title}</div>
                  <div className="text-sm">{new Date(post.published_at).toLocaleString("en-US")}</div>
                  <div className="mt-2">
                    {post.tags?.length > 0
                      ? post.tags.map((tag) => {
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              className="py-1 px-2 mr-2 text-white rounded"
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
          })}
        </div>
      </section>
      <section>
        <article id="about" className="prose mb-20 pt-4" dangerouslySetInnerHTML={{ __html: about.aboutHtmlString }} />
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
