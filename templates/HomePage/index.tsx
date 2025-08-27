"use client";

import Layout from "@/components/Layout";
import Main from "./Main";

type NavItem = {
  title: string;
  icon: string;
  color: string;
  url: string;
};

type Props = {
  heroTitle: string;
  heroSubtitle: string;
  navigationItems: NavItem[]; // <- schon übersetzt vom Server
};

const HomePage = ({ heroTitle, heroSubtitle, navigationItems }: Props) => {
  return (
    <Layout>
      <Main
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        items={navigationItems}
      />
    </Layout>
  );
};

export default HomePage;
