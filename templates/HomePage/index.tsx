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
  navigationItems: NavItem[];
  inputPlaceholder?: string; // ⬅️ NUR DIESE ZEILE HINZUFÜGEN
};

const HomePage = ({ 
  heroTitle, 
  heroSubtitle, 
  navigationItems, 
  inputPlaceholder // ⬅️ NUR DIESE ZEILE HINZUFÜGEN
}: Props) => {
  return (
    <Layout>
      <Main
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        items={navigationItems}
        inputPlaceholder={inputPlaceholder} // ⬅️ NUR DIESE ZEILE HINZUFÜGEN
      />
    </Layout>
  );
};

export default HomePage;
