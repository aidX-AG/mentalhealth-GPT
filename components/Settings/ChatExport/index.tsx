import { useState, useCallback, useMemo, useEffect } from "react";
import Switch from "@/components/Switch";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import { useI18n } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * ChatExport
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - Stable IDs for selection; labels remain translated
 * - Export toggle disables controls instead of overwriting user selection
 * - Submit guard prevents accidental empty exports
 * ============================================================================
 */

type FileTypeItem = { id: string; title: string };

type CheckboxItem = {
  id: string;
  title: string;
  color: string;
  isChecked: boolean;
};

type ChatExportProps = Record<string, never>;

const ChatExport = ({}: ChatExportProps) => {
  const { locale, t } = useI18n();

  const typesFile: FileTypeItem[] = useMemo(
    () => [
      { id: "pdf", title: t("PDF") },
      { id: "doc", title: t("DOC") },
      { id: "jpg", title: t("JPG") },
    ],
    [locale, t]
  );

  const defaultCheckboxes = useMemo<CheckboxItem[]>(
    () => [
      {
        id: "production",
        title: t("UI8 Production"),
        color: "#3E90F0",
        isChecked: true,
      },
      {
        id: "favourite",
        title: t("Favourite"),
        color: "#8E55EA",
        isChecked: true,
      },
      {
        id: "archived",
        title: t("Archived"),
        color: "#8C6584",
        isChecked: false,
      },
      {
        id: "deleted",
        title: t("Deleted"),
        color: "#D84C10",
        isChecked: false,
      },
    ],
    [locale, t]
  );

  const [exportChat, setExportChat] = useState<boolean>(false);
  const [typeFileId, setTypeFileId] = useState<string>("pdf");
  const [checkboxes, setCheckboxes] =
    useState<CheckboxItem[]>(defaultCheckboxes);

  const typeFile = useMemo(
    () => typesFile.find((x) => x.id === typeFileId) ?? typesFile[0],
    [typesFile, typeFileId]
  );

  // Keep typeFileId valid if list changes
  useEffect(() => {
    if (typesFile.length > 0 && !typesFile.some((x) => x.id === typeFileId)) {
      setTypeFileId(typesFile[0].id);
    }
  }, [typesFile, typeFileId]);

  // Re-sync translated titles on locale change; preserve isChecked
  useEffect(() => {
    setCheckboxes((prev) => {
      return defaultCheckboxes.map((newCb) => {
        const oldCb = prev.find((c) => c.id === newCb.id);
        return {
          ...newCb,
          isChecked: oldCb?.isChecked ?? newCb.isChecked,
        };
      });
    });
  }, [defaultCheckboxes]);

  const handleCheckboxChange = useCallback((checkboxId: string) => {
    setCheckboxes((prev) =>
      prev.map((checkbox) =>
        checkbox.id === checkboxId
          ? { ...checkbox, isChecked: !checkbox.isChecked }
          : checkbox
      )
    );
  }, []);

  const handleExportChatChange = useCallback((value: boolean) => {
    setExportChat(value);
    // Excellence UX: do NOT overwrite user's selection; just enable/disable UI
  }, []);

  const canSubmit = exportChat && checkboxes.some((c) => c.isChecked);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      // TODO: implement export
      // - use selected checkbox ids
      // - export format: typeFileId
      // - server-side authorization + audit trail (no sensitive content in logs)
    },
    [canSubmit]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 h4">{t("Chat export")}</div>

      <div className="flex items-center mb-8">
        <div className="mr-auto base2 text-n-4">
          {t("Select chat list to export")}
        </div>
        <Switch value={exportChat} setValue={handleExportChatChange} />
      </div>

      <div className="mb-6">
        {checkboxes.map((checkbox) => {
          const inputId = `chat-export-${checkbox.id}`;

          return (
            <label
              htmlFor={inputId}
              className={`flex items-center h-14 mb-2 p-4 rounded-xl base2 font-semibold text-n-4 transition-colors cursor-pointer last:mb-0 dark:hover:bg-n-6 ${
                exportChat ? "hover:bg-n-2" : "opacity-60 cursor-not-allowed"
              } ${
                checkbox.isChecked &&
                exportChat &&
                "!bg-primary-1/5 text-n-6 dark:text-n-3"
              }`}
              key={checkbox.id}
            >
              <input
                id={inputId}
                className="absolute top-0 left-0 opacity-0 invisible"
                type="checkbox"
                checked={checkbox.isChecked}
                onChange={() => handleCheckboxChange(checkbox.id)}
                disabled={!exportChat}
              />

              <div className="flex justify-center items-center shrink-0 w-6 h-6 mr-3">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: checkbox.color }}
                  aria-hidden="true"
                />
              </div>

              {checkbox.title}

              <Icon
                className={`ml-auto fill-primary-1 opacity-0 transition-opacity ${
                  checkbox.isChecked && exportChat && "opacity-100"
                }`}
                name="check-thin"
                aria-hidden="true"
              />
            </label>
          );
        })}
      </div>

      <div className="inline-flex bg-primary-1 rounded-xl md:w-full">
        <button
          type="submit"
          className="btn-blue pr-4 rounded-r-none md:grow"
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
        >
          {t("Download conversation")}
        </button>

        <div className="self-center w-0.25 h-8 bg-n-1/20" />

        <Select
          classButton="h-12 rounded-l-none rounded-r-xl shadow-[inset_0_0_0_0.0625rem_#0084FF] bg-transparent text-n-1 font-semibold dark:bg-transparent"
          classArrow="fill-n-1"
          classOptions="min-w-full"
          items={typesFile}
          value={typeFile}
          onChange={(item) => item && setTypeFileId(String(item.id))}
          up
        />
      </div>
    </form>
  );
};

export default ChatExport;
