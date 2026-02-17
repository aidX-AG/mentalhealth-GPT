import { useEffect, useState } from "react";
import Image from "@/components/Image";
import Document from "./Document";
import { useTranslation } from "@/lib/i18n/I18nContext";

type QuestionProps = {
  content: React.ReactNode;
  image?: string;
  document?: string;
  time?: string;
};

const Question = ({ content, image, document, time }: QuestionProps) => {
  const t = useTranslation();
  const hasTime = typeof time === "string" && time.trim().length > 0;

  // SSR-safe: avoid time hydration mismatches (timezone/locale)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-[50rem] ml-auto">
      <div className="space-y-6 pt-6 px-6 pb-16 border-3 border-n-2 rounded-[1.25rem] md:p-5 md:pb-14 dark:border-transparent dark:bg-n-5/50">
        {document && <Document value={document} />}
        <div>{content}</div>

        {image && (
          <div className="relative w-[11.25rem] h-[11.25rem]">
            <Image className="rounded-xl object-cover" src={image} fill alt={t("Uploaded image")} />
          </div>
        )}
      </div>

      <div className="-mt-8 flex items-end pr-6">
        {mounted && hasTime && (
          <div className="pb-0.5 caption1 text-n-4/50 dark:text-n-4" title={time}>
            {time}
          </div>
        )}

        <div
          className="relative w-16 h-16 ml-auto rounded-2xl overflow-hidden shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]"
          aria-hidden="true"
        >
          <Image className="object-cover" src="/images/wip-portrait.jpg" fill alt="" />
        </div>
      </div>
    </div>
  );
};

export default Question;
