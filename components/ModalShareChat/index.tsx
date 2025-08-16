import { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import Field from "@/components/Field";
import MultiSelect from "@/components/MultiSelect";
import Notify from "@/components/Notify";

import { people } from "@/mocks/people";
import i18next from "i18next";

type ModalShareChatProps = {
    visible: boolean;
    onClose: () => void;
};

const ModalShareChat = ({ visible, onClose }: ModalShareChatProps) => {
  const { t: tCommon } = useTranslation("common");

    const [link, setLink] = useState<string>(
        "https://ui8.net/ui8/products/brainwave-ai-ui-design-kit"
    );
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [copied, setCopied] = useState<boolean>(false);

    const onCopy = () => {
        setCopied(true);
        toast((t) => (
            <Notify iconCheck>
                <div className="ml-3 h6">{tCommon("notify.link-copied", { defaultValue: "Link copied" })}</div>
            </Notify>
        ));
    };

    let copyButtonRef = useRef(null);

    return (
        <Modal
            classWrap="max-w-[40rem]"
            classButtonClose="absolute top-6 right-6 w-10 h-10 rounded-full bg-n-2 md:top-5 md:right-5 dark:bg-n-4/25 dark:fill-n-4 dark:hover:fill-n-1"
            visible={visible}
            onClose={onClose}
            initialFocus={copyButtonRef}
        >
            <form
                className="p-12 md:p-5"
                action=""
                onSubmit={() => console.log("Submit")}
            >
                <div className="mb-8 h4">{tCommon("form.share-chat", { defaultValue: "Share this chat" })}</div>
                <div className="mb-4 base2 font-semibold text-n-6 dark:text-n-3">
                    {tCommon("form.copy-link", { defaultValue: "Copy link" })}</div>
                <div className="relative mb-8">
                    <Field
                        classInput="h-14 pr-[6.25rem] bg-n-2 truncate text-[1rem] text-n-4 border-transparent focus:bg-n-2 md:base2"
                        placeholder={tCommon("placeholders.link", { defaultValue: "Link" })}
                        value={link}
                        onChange={(e: any) => setLink(e.target.value)}
                        required
                    />
                    <CopyToClipboard text={link} onCopy={onCopy}>
                        <button
                            className="btn-dark absolute top-1 right-1"
                            ref={copyButtonRef}
                            type="button"
                        >
                            {tCommon("actions.copy", { defaultValue: "Copy" })}</button>
                    </CopyToClipboard>
                </div>
                <div className="mb-4 base2 font-semibold text-n-6 dark:text-n-3">
                    {tCommon("form.share-to-members", { defaultValue: "Or share to members" })}</div>
                <MultiSelect
                    className="mb-8"
                    items={people}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />
                <div className="flex justify-end">
                    <button className="btn-stroke-light mr-3" onClick={onClose}>
                        {tCommon("buttons.cancel", { defaultValue: "Cancel" })}</button>
                    <button className="btn-blue">{tCommon("misc.share", { defaultValue: "Share" })}</button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalShareChat;
