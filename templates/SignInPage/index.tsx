"use client";

import Link from "next/link";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Form from "./Form";

type SignInPageProps = {
  heroTitle: string;    // "Unlock the power of AI"
  heroSubtitle: string; // "Chat with the smartest AI ..."
  closeHref?: string;
  children?: React.ReactNode;
} & React.ComponentProps<typeof Form>;

const SignInPage = ({
  heroTitle,
  heroSubtitle,
  closeHref = "/",
  children,
  ...formProps
}: SignInPageProps) => {
  return (
    <div className="relative flex min-h-screen min-h-screen-ios lg:p-6 md:px-6 md:pt-16 md:pb-10">
      {/* LINKE SPALTE */}
      <div className="relative shrink-0 w-[40rem] p-20 overflow-hidden 2xl:w-[37.5rem] xl:w-[30rem] xl:p-10 lg:hidden flex flex-col items-center text-center">
        <div className="max-w-[25.4rem] mx-auto">
          <div className="mb-4 h2 text-n-1">{heroTitle}</div>
          <div className="body1 text-n-3">{heroSubtitle}</div>
        </div>
        {/* Bild nochmals etwas tiefer (ca. +10 %) */}
        <div className="absolute left-5 right-5 top-[18rem] 2xl:top-[16rem] xl:top-[15rem] bottom-10 flex justify-center">
          <Image
            className="object-contain scale-[0.85] origin-center"
            src="/images/create-pic.png"
            fill
            sizes="(max-width: 1180px) 50vw, 33vw"
            alt=""
          />
        </div>
      </div>

      {/* RECHTE SPALTE */}
      <div className="flex grow my-6 mr-6 p-10 bg-n-1 rounded-[1.25rem] lg:m-0 md:p-0 dark:bg-n-6">
        {children ? <>{children}</> : <Form {...formProps} />}
      </div>

      <Link
        className="group absolute top-12 right-12 flex justify-center items-center w-10 h-10 bg-n-2 rounded-full text-0"
        href={closeHref}
      >
        <Icon className="fill-n-7 transition-colors group-hover:fill-n-1" name="close" />
      </Link>
    </div>
  );
};

export default SignInPage;
