import { useState, useCallback } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import Field from "@/components/Field";
import MultiSelect from "@/components/MultiSelect";
import Notify from "@/components/Notify";
import { people } from "@/mocks/people";
import { useTranslation } from "@/lib/i18n/I18nContext";

type PersonOption = (typeof people)[number];

type ModalShareChatProps = {
  visible: boolean;
  onClose: () => void;
};

const ModalShareChat = ({ visible, onClose }: ModalShareChatProps) => {
  const t = useTranslation();

  const [link, setLink] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<PersonOption[]>([]);

  const onCopy = useCallback(() => {
    toast(() => (
      <Notify iconCheck>
        <div className="ml-3 h6">{t("Link copied")}</div>
      </Notify>
    ));
  }, [t]);

  const handleLinkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: share chat
      console.log("[share-chat]", { link, selectedOptions });
      onClose();
    },
    [link, selectedOptions, onClose]
  );

  return (
    <Modal
      classWrap="max-w-[40rem]"
      classButtonClose="absolute top-6 right-6 w-10 h-10 rounded-full bg-n-2 md:top-5 md:right-5"
      visible={visible}
      onClose={onClose}
    >
      <form className="p-12 md:p-5" onSubmit={handleSubmit}>
        <div className="mb-8 h4">{t("Share this chat")}</div>

        <div className="mb-4 base2 font-semibold text-n-6 dark:text-n-3">
          {t("Copy link")}
        </div>

        <div className="relative mb-8">
          <Field
            classInput="h-14 pr-[6.25rem] bg-n-2 truncate text-[1rem] text-n-4 border-transparent focus:bg-n-1 dark:bg-n-6 dark:focus:bg-n-6"
            placeholder={t("Link")}
            type="text"
            value={link}
            onChange={handleLinkChange}
          />

          <CopyToClipboard text={link} onCopy={onCopy}>
            <button className="btn-dark absolute top-1 right-1" type="button" disabled={!link}>
              {t("Copy")}
            </button>
          </CopyToClipboard>
        </div>

        <div className="mb-4 base2 font-semibold text-n-6 dark:text-n-3">
          {t("Or share to members")}
        </div>

        <MultiSelect
          className="mb-8"
          items={people}
          selectedOptions={selectedOptions}
          setSelectedOptions={(options) => setSelectedOptions(options as PersonOption[])}
        />

        <div className="flex justify-end">
          <button className="btn-stroke-light mr-3" type="button" onClick={onClose}>
            {t("Cancel")}
          </button>
          <button className="btn-blue" type="submit" disabled={!link && selectedOptions.length === 0}>
            {t("Share")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalShareChat;
