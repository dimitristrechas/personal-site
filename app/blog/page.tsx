import { Metadata } from "next";
import ClientComponent from "./ClientComponent";

export const metadata: Metadata = {
  title: "Dimitris Trechas - Blog",
};

async function getPosts() {
  const res = await fetch(
    `${process.env.API_ENDPOINT}/posts?populate=%2A&sort[1]=createdAt%3Adesc`,
  );

  return await res.json().then((data) => data.data);
}

export default async function Page() {
  const posts = await getPosts();

  return <ClientComponent posts={posts} />;
}
