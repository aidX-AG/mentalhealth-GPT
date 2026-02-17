import { useMemo, useCallback, useEffect, useState } from "react";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import View from "./View";
import { useI18n } from "@/lib/i18n/I18nContext";

type LanguageItem = { id: string; title: string };
type VoiceItem = { id: string; title: string };

type VideoProps = {
  onDownload?: () => void;
};

const Video = ({ onDownload }: VideoProps) => {
  const { locale, t } = useI18n();

  const languages: LanguageItem[] = useMemo(
    () => [
      { id: "en-US", title: t("English (United States)") },
      { id: "fr", title: t("French") },
      { id: "uk", title: t("Ukrainian") },
    ],
    [locale, t]
  );

  const voices: VoiceItem[] = useMemo(
    () => [
      { id: "jenny", title: t("Jenny") },
      { id: "mark", title: t("Mark") },
      { id: "jack", title: t("Jack") },
    ],
    [locale, t]
  );

  // ✅ Store stable IDs (locale changes won't break selection)
  const [languageId, setLanguageId] = useState<string>("en-US");
  const [voiceId, setVoiceId] = useState<string>("jenny");

  const language = useMemo(
    () => languages.find((l) => l.id === languageId) ?? languages[0],
    [languages, languageId]
  );

  const voice = useMemo(
    () => voices.find((v) => v.id === voiceId) ?? voices[0],
    [voices, voiceId]
  );

  // ✅ If current selection disappears (future: dynamic lists), fall back safely
  useEffect(() => {
    if (!languages.some((l) => l.id === languageId) && languages[0]) {
      setLanguageId(languages[0].id);
    }
  }, [languages, languageId]);

  useEffect(() => {
    if (!voices.some((v) => v.id === voiceId) && voices[0]) {
      setVoiceId(voices[0].id);
    }
  }, [voices, voiceId]);

  const canDownload = typeof onDownload === "function";

  const handleDownload = useCallback(() => {
    onDownload?.();
  }, [onDownload]);

  return (
    <div>
      <View />

      <div className="mt-4">
        {t(
          "Based on the gender identified in the uploaded image, the video has been automatically generated with a male voice. However, you have the option to customize your video by selecting from the available options below."
        )}
      </div>

      <div className="flex flex-wrap">
        <button
          type="button"
          className="btn-dark btn-small mr-4 mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
          onClick={handleDownload}
          disabled={!canDownload}
          aria-disabled={!canDownload}
        >
          <span>{t("Download")}</span>
          <Icon name="download" aria-hidden="true" />
        </button>

        <Select
          className="mr-4 mt-4"
          classOptions="min-w-[12rem]"
          items={languages}
          value={language}
          onChange={(item) => setLanguageId(item.id)}
          small
          up
        />

        <Select
          title={t("Voice")}
          icon="volume"
          className="mr-4 mt-4"
          items={voices}
          value={voice}
          onChange={(item) => setVoiceId(item.id)}
          small
          up
        />
      </div>
    </div>
  );
};

export default Video;
