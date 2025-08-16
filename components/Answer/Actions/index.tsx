import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import Image from "@/components/Image";
import Notify from "@/components/Notify";
import ModalShareChat from "@/components/ModalShareChat";
import i18next from "i18next";

type ActionsProps = {};

const Actions = ({}: ActionsProps) => {
  const { t: tCommon } = useTranslation("common");

    const [copied, setCopied] = useState<boolean>(false);
    const [share, setShare] = useState<boolean>(false);
    const [archive, setArchive] = useState<boolean>(false);
    const [visibleModal, setVisibleModal] = useState<boolean>(false);

    const onCopy = () => {
        setCopied(true);
        toast((t) => (
            <Notify iconCheck>
                <div className="ml-3 h6">{tCommon("notify.content-copied", { defaultValue: "Content copied" })}</div>
            </Notify>
        ));
    };

    const handleClick = () => {
        toast((t) => (
            <Notify iconCheck>
                <div className="mr-6 ml-3 h6">{tCommon("notify.chat-archived", { defaultValue: "1 chat archived" })}</div>
                <button
                    className="btn-blue btn-medium ml-3"
                    onClick={() => toast.dismiss(t.id)}
                >
                    {tCommon("notify.undo", { defaultValue: "Undo" })}</button>
            </Notify>
        ));
    };

    const styleButton: string =
        "h-6 ml-3 px-2 bg-n-3 rounded-md caption1 txt-n-6 transition-colors hover:text-primary-1 dark:bg-n-7";

    return (
        <>
            <CopyToClipboard text="Content" onCopy={onCopy}>
                <button className={`${styleButton} md:hidden`}>{tCommon("actions.copy", { defaultValue: "Copy" })}</button>
            </CopyToClipboard>
            <button className={styleButton}>{tCommon("fragments.regenerate-response", { defaultValue: "Regenerate response" })}</button>
            {!share && !archive && (
                <div className="flex ml-3 px-1 space-x-1 bg-n-3 rounded-md md:hidden dark:bg-n-7">
                    <button className="" onClick={() => setShare(true)}>
                        <Image
                            src="/images/smile-heart-eyes.png"
                            width={24}
                            height={24}
                            alt={tCommon("alt.smile-heart-eyes", { defaultValue: "Smile heart eyes" })}
                        />
                    </button>
                    <button className="" onClick={() => setArchive(true)}>
                        <Image
                            src="/images/smile-unamused.png"
                            width={24}
                            height={24}
                            alt={tCommon("alt.smile-unamused", { defaultValue: "Smile unamused" })}
                        />
                    </button>
                </div>
            )}
            {share && (
                <button
                    className={`flex items-center ${styleButton} pl-1 md:hidden`}
                    onClick={() => setVisibleModal(true)}
                >
                    <Image
                        src="/images/smile-heart-eyes.png"
                        width={24}
                        height={24}
                        alt={tCommon("alt.smile-heart-eyes", { defaultValue: "Smile heart eyes" })}
                    />
                    {tCommon("badges.share", { defaultValue: "Share" })}</button>
            )}
            {archive && (
                <button
                    className={`flex items-center ${styleButton} pl-1 md:hidden`}
                    onClick={handleClick}
                >
                    <Image
                        src="/images/smile-unamused.png"
                        width={24}
                        height={24}
                        alt={tCommon("alt.smile-unamused", { defaultValue: "Smile unamused" })}
                    />
                    {tCommon("badges.archive-chat", { defaultValue: "Archive chat" })}</button>
            )}
            <ModalShareChat
                visible={visibleModal}
                onClose={() => setVisibleModal(false)}
            />
        </>
    );
};

export default Actions;
