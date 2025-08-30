import { ChangeEventHandler } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import AddFile from "./AddFile";
import Files from "./Files";
import { getT } from "@/lib/i18n-runtime";

const t = getT();

type MessageProps = {
  value: any;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  image?: string;
  document?: any;
};

const Message = ({
  value,
  onChange,
  placeholder,
  image,
  document,
}: MessageProps) => {
  const stylesButton = "group absolute right-3 bottom-2 w-10 h-10";

  return (
    <div className="relative z-5 px-10 pb-6 before:absolute before:-top-6 before:left-0 before:right-6 before:h-6 before:bg-gradient-to-b before:from-n-1 before:to-transparent dark:before:from-n-7">
      <div className="relative z-2 border-2 border-n-3 rounded-xl overflow-hidden dark:border-n-5">
        {(image || document) && <Files image={image} document={document} />}

        <div className="relative flex items-center min-h-[3.5rem] px-16 text-0">
          <AddFile />

          {/* EINZIGE Änderung: placeholder jetzt übersetzbar per t(...) */}
          <TextareaAutosize
            className="w-full py-3 bg-transparent body2 text-n-7 outline-none resize-none placeholder:text-n-4/75 dark:text-n-1 dark:placeholder:text-n-4"
            maxRows={5}
            autoFocus
            value={value}
            onChange={onChange}
            placeholder={placeholder || t("Ask mentalhealthGPT anything")}
          />

          {value === "" ? (
            <button className={`${stylesButton}`}>
              <Icon
                className="fill-n-4 transition-colors group-hover:fill-primary-1"
                name={t("recording")}
              />
            </button>
          ) : (
            <button
              className={`${stylesButton} bg-primary-1 rounded-xl transition-colors hover:brightness-110`}
            >
              <Icon className="fill-n-1" name={t("arrow-up")} />
            </button>
          )}
        </div>
      </div>

      {/* 
      <div className="relative mt-2 px-5 py-1 bg-n-3 rounded-xl text-0 dark:bg-n-7">
        <Image src="/images/audio-1.svg" width={614} height={39} alt="Audio" />
      </div>
      */}

      {/*
      <div className="relative mt-2 px-4.5 py-2.5 rounded-xl border-2 border-accent-1 text-accent-1">
        Sorry, voice recognition failed. Please try again or contact support.
      </div>
      */}
    </div>
  );
};

export default Message;
