"use client";

import Layout from "@/components/Layout";
import Main from "./Main";

type Props = {
  heroTitle: string;
  heroSubtitle: string;
};

const HomePage = ({ heroTitle, heroSubtitle }: Props) => {
  return (
    <Layout>
      <Main heroTitle={heroTitle} heroSubtitle={heroSubtitle} />
    </Layout>
  );
};

export default HomePage;
