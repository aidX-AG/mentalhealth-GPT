"use client";

import { Tab } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Updates from "./Updates";
import Faq from "./Faq";
import { updates } from "@/mocks/updates";
import { faqs } from "@/mocks/faq";

type Props = {
  title: string;
  subtitle: string;
  tabs: string[];
};

const UpdatesAndFaqPage = ({ title, subtitle, tabs }: Props) => {
  const router = useRouter();

  return (
    <Layout hideRightSidebar>
      <div className="p-20 2xl:px-10 md:pt-6 md:px-6 md:pb-10">
        <button
          className="hidden absolute top-6 right-6 w-10 h-10 border-2 border-n-4/25 rounded-full text-0 transition-colors hover:border-transparent hover:bg-n-4/25 md:block"
          onClick={() => router.back()}
        >
          <Icon className="fill-n-4" name="close" />
        </button>

        <div className="max-w-[58.5rem] mx-auto">
          <div className="mb-4 h2 md:pr-16 md:h3">{title}</div>
          <div className="mb-12 body1 text-n-4 md:mb-6">{subtitle}</div>

          <Tab.Group defaultIndex={0}>
            <Tab.List className="mb-12 md:mb-6 space-x-3">
              {tabs.map((label, i) => (
                <Tab
                  key={i}
                  className="h-10 px-6 rounded-full base1 text-n-4 transition-colors outline-none tap-highlight-color hover:text-n-7 ui-selected:bg-primary-1 ui-selected:!text-n-1 dark:hover:text-n-1"
                >
                  {label}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel>
                <Updates items={updates} />
              </Tab.Panel>
              <Tab.Panel>
                <Faq items={faqs} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Layout>
  );
};

export default UpdatesAndFaqPage;
