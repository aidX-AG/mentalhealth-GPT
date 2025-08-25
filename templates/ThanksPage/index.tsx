"use client";

import Link from "next/link";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Menu from "@/components/Menu";
import { navigation } from "@/constants/navigation";

type Props = {
  title: string;
  subtitle: string;
  manageSubscriptionLabel: string;
  startNewChatLabel: string;
};

const ThanksPage = ({
  title,
  subtitle,
  manageSubscriptionLabel,
  startNewChatLabel,
}: Props) => {
  return (
    <Layout smallSidebar hideRightSidebar>
      <div className="flex items-center grow p-15 lg:py-10 md:px-8">
        <div className="flex items-center w-full max-w-[60.75rem] mx-auto lg:block">
          <div className="grow pr-20 xl:pr-16 lg:pr-0">
            <div className="flex justify-center items-center w-32 h-32 mb-12 rounded-full bg-primary-2 xl:w-20 xl:h-20 lg:mx-auto lg:mb-6">
              <Icon className="w-12 h-12" name="check-thin" />
            </div>

            <div className="mb-6 h2 2xl:h3 xl:h4 lg:text-center">
              {title}
            </div>
            <div className="mb-8 body1 text-n-4 xl:body2 lg:text-center">
              {subtitle}
            </div>

            <div className="flex xl:block lg:flex lg:space-x-4 md:block md:space-x-0 md:space-y-3">
              <Link className="btn-stroke-light mr-3 xl:w-full xl:mr-0 xl:mb-4 lg:mb-0" href="/pricing">
                {manageSubscriptionLabel}
              </Link>
              <Link className="btn-blue xl:w-full" href="/">
                {startNewChatLabel}
              </Link>
            </div>
          </div>

          <Menu className="shrink-0 w-[27.875rem] lg:w-full lg:mt-10" items={navigation} />
        </div>
      </div>
    </Layout>
  );
};

export default ThanksPage;
