import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import Image from "@/components/Image";
import Notify from "@/components/Notify";
import ModalShareChat from "@/components/ModalShareChat";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type ActionsProps = {};
const Actions = ({}: ActionsProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);
  const [archive, setArchive] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const onCopy = () => {
    setCopied(true);
    toast(t => <Notify iconCheck>
                <div className="ml-3 h6">{t("Content copied")}</div>
            </Notify>);
  };
  const handleClick = () => {
    toast(t => <Notify iconCheck>
                <div className="mr-6 ml-3 h6">{t("1 chat archived")}</div>
                <button className="btn-blue btn-medium ml-3" onClick={() => toast.dismiss(t.id)}>{t("Undo")}</button>
            </Notify>);
  };
  const styleButton: string = "h-6 ml-3 px-2 bg-n-3 rounded-md caption1 txt-n-6 transition-colors hover:text-primary-1 dark:bg-n-7";
  return <>
            <CopyToClipboard text={t("Content")} onCopy={onCopy}>
                <button className={`${styleButton} md:hidden`}>{t("Copy")}</button>
            </CopyToClipboard>
            <button className={styleButton}>{t("Regenerate response")}</button>
            {!share && !archive && <div className="flex ml-3 px-1 space-x-1 bg-n-3 rounded-md md:hidden dark:bg-n-7">
                    <button className="" onClick={() => setShare(true)}>
                        <Image src="/images/smile-heart-eyes.png" width={24} height={24} alt={t("Smile heart eyes")} />
                    </button>
                    <button className="" onClick={() => setArchive(true)}>
                        <Image src="/images/smile-unamused.png" width={24} height={24} alt={t("Smile unamused")} />
                    </button>
                </div>}
            {share && <button className={`flex items-center ${styleButton} pl-1 md:hidden`} onClick={() => setVisibleModal(true)}>
                    <Image src="/images/smile-heart-eyes.png" width={24} height={24} alt={t("Smile heart eyes")} />{t("Share")}</button>}
            {archive && <button className={`flex items-center ${styleButton} pl-1 md:hidden`} onClick={handleClick}>
                    <Image src="/images/smile-unamused.png" width={24} height={24} alt={t("Smile unamused")} />{t("Archive chat")}</button>}
            <ModalShareChat visible={visibleModal} onClose={() => setVisibleModal(false)} />
        </>;
};
export default Actions;