"use client";

import { useState } from "react";
import Message from "@/components/Message";
import Menu from "@/components/Menu";

type NavItem = {
  title: string;
  icon: string;
  color: string;
  url: string;
};

type MainProps = {
  heroTitle: string;
  heroSubtitle: string;
  items: NavItem[]; // ← schon übersetzt vom Server
};

const Main = ({ heroTitle, heroSubtitle, items }: MainProps) => {
  const [message, setMessage] = useState<string>("");

  return (
    <>
      <div className="grow px-10 py-20 overflow-y-auto scroll-smooth scrollbar-none 2xl:py-12 md:px-4 md:pt-0 md:pb-6">
        <div className="mb-10 text-center">
          <div className="h3 leading-[4rem] 2xl:mb-2 2xl:h4">{heroTitle}</div>
          <div className="body1 text-n-4 2xl:body1S">{heroSubtitle}</div>
        </div>
        <Menu className="max-w-[30.75rem] mx-auto" items={items} />
      </div>

      <Message value={message} onChange={(e: any) => setMessage(e.target.value)} />
    </>
  );
};

export default Main;
