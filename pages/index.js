import { Layout } from "antd";
import fs from "fs";
import Link from "next/link";
const { Header, Footer, Sider, Content } = Layout;

const Home = ({ slugs }) => (
  <div>
    <Layout>
      <Sider>
        Sider:
        {slugs.map((slug) => {
          return (
            <div key={slug}>
              <Link href="/blog/[slug]" as={"/blog/" + slug}>
                <a>{"/blog/" + slug}</a>
              </Link>
            </div>
          );
        })}
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  </div>
);

export const getStaticProps = async () => {
  const files = fs.readdirSync("posts");

  return {
    props: { slugs: files.map((filename) => filename.replace(".md", "")) },
  };
};

export default Home;
