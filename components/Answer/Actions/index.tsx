import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import Image from "@/components/Image";
import Notify from "@/components/Notify";
import ModalShareChat from "@/components/ModalShareChat";
import i18next from "i18next";

type ActionsProps = {};

const Actions = ({}: ActionsProps) => {
    const [copied, setCopied] = useState<boolean>(false);
    const [share, setShare] = useState<boolean>(false);
    const [archive, setArchive] = useState<boolean>(false);
    const [visibleModal, setVisibleModal] = useState<boolean>(false);

    const onCopy = () => {
        setCopied(true);
        toast((t) => (
            <Notify iconCheck>
                <div className="ml-3 h6">{i18next.t("common.notify_content_copied_01", { defaultValue: "Content copied" })}</div>
            </Notify>
        ));
    };

    const handleClick = () => {
        toast((t) => (
            <Notify iconCheck>
                <div className="mr-6 ml-3 h6">{i18next.t("common.notify_1_chat_archived_02", { defaultValue: "1 chat archived" })}</div>
                <button
                    className="btn-blue btn-medium ml-3"
                    onClick={() => toast.dismiss(t.id)}
                >
                    {i18next.t("common.notify_undo_03", { defaultValue: "Undo" })}</button>
            </Notify>
        ));
    };

    const styleButton: string =
        "h-6 ml-3 px-2 bg-n-3 rounded-md caption1 txt-n-6 transition-colors hover:text-primary-1 dark:bg-n-7";

    return (
        <>
            <CopyToClipboard text="Content" onCopy={onCopy}>
                <button className={`${styleButton} md:hidden`}>{i18next.t("common.copytoclipboard_copy_04", { defaultValue: "Copy" })}</button>
            </CopyToClipboard>
            <button className={styleButton}>{i18next.t("common.fragment_regenerate_response_05", { defaultValue: "Regenerate response" })}</button>
            {!share && !archive && (
                <div className="flex ml-3 px-1 space-x-1 bg-n-3 rounded-md md:hidden dark:bg-n-7">
                    <button className="" onClick={() => setShare(true)}>
                        <Image
                            src="/images/smile-heart-eyes.png"
                            width={24}
                            height={24}
                            alt={i18next.t("common.imagealt_smile_heart_eyes_08", { defaultValue: "Smile heart eyes" })}
                        />
                    </button>
                    <button className="" onClick={() => setArchive(true)}>
                        <Image
                            src="/images/smile-unamused.png"
                            width={24}
                            height={24}
                            alt={i18next.t("common.imagealt_smile_unamused_09", { defaultValue: "Smile unamused" })}
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
                        alt={i18next.t("common.imagealt_smile_heart_eyes_10", { defaultValue: "Smile heart eyes" })}
                    />
                    {i18next.t("common.node_share_06", { defaultValue: "Share" })}</button>
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
                        alt={i18next.t("common.imagealt_smile_unamused_11", { defaultValue: "Smile unamused" })}
                    />
                    {i18next.t("common.node_archive_chat_07", { defaultValue: "Archive chat" })}</button>
            )}
            <ModalShareChat
                visible={visibleModal}
                onClose={() => setVisibleModal(false)}
            />
        </>
    );
};

export default Actions;
