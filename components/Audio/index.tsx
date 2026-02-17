import { useState, useMemo, useCallback, useEffect } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import Actions from "@/components/Actions";
import Export from "@/components/Export";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import { useI18n } from "@/lib/i18n/I18nContext";

type LanguageItem = { id: string; title: string };
type SpeedItem = { id: string; title: string };
type GenderItem = { id: string; title: string };
type VoiceItem = { id: string; title: string };
type SmileItem = { id: string; title: string };

type AudioProps = Record<string, never>;

const Audio = ({}: AudioProps) => {
  const { t } = useI18n();

  const languages: LanguageItem[] = useMemo(
    () => [
      { id: "en-US", title: t("English (US)") },
      { id: "fr", title: t("French") },
      { id: "uk", title: t("Ukrainian") },
    ],
    [t]
  );

  const speeds: SpeedItem[] = useMemo(
    () => [
      { id: "normal", title: t("Normal") },
      { id: "1.25x", title: t("1.25x") },
      { id: "1.5x", title: t("1.5x") },
    ],
    [t]
  );

  const genders: GenderItem[] = useMemo(
    () => [
      { id: "female", title: t("Female") },
      { id: "male", title: t("Man") },
    ],
    [t]
  );

  const voices: VoiceItem[] = useMemo(
    () => [
      { id: "jenny", title: t("Jenny") },
      { id: "mark", title: t("Mark") },
      { id: "jack", title: t("Jack") },
    ],
    [t]
  );

  const smiles: SmileItem[] = useMemo(
    () => [
      { id: "friendly", title: t("😀 Friendly") },
      { id: "neutral", title: t("😐 Neutral") },
      { id: "kissing", title: t("😚 Kissing") },
    ],
    [t]
  );

  // ✅ Store stable IDs (locale changes won't break selection)
  const [languageId, setLanguageId] = useState<string>("en-US");
  const [speedId, setSpeedId] = useState<string>("normal");
  const [genderId, setGenderId] = useState<string>("female");
  const [voiceId, setVoiceId] = useState<string>("jenny");
  const [smileId, setSmileId] = useState<string>("friendly");
  const [edit, setEdit] = useState<boolean>(false);

  const language = useMemo(
    () => languages.find((l) => l.id === languageId) ?? languages[0],
    [languages, languageId]
  );

  const speed = useMemo(
    () => speeds.find((s) => s.id === speedId) ?? speeds[0],
    [speeds, speedId]
  );

  const gender = useMemo(
    () => genders.find((g) => g.id === genderId) ?? genders[0],
    [genders, genderId]
  );

  const voice = useMemo(
    () => voices.find((v) => v.id === voiceId) ?? voices[0],
    [voices, voiceId]
  );

  const smile = useMemo(
    () => smiles.find((s) => s.id === smileId) ?? smiles[0],
    [smiles, smileId]
  );

  // ✅ Helper: If current selection disappears (future: dynamic lists), fall back safely
  const ensureValid = useCallback(
    (list: { id: string }[], currentId: string, setId: (id: string) => void) => {
      if (list.length === 0) return;
      if (!list.some((x) => x.id === currentId)) setId(list[0].id);
    },
    []
  );

  useEffect(() => ensureValid(languages, languageId, setLanguageId), [
    languages,
    languageId,
    ensureValid,
  ]);

  useEffect(() => ensureValid(speeds, speedId, setSpeedId), [
    speeds,
    speedId,
    ensureValid,
  ]);

  useEffect(() => ensureValid(genders, genderId, setGenderId), [
    genders,
    genderId,
    ensureValid,
  ]);

  useEffect(() => ensureValid(voices, voiceId, setVoiceId), [
    voices,
    voiceId,
    ensureValid,
  ]);

  useEffect(() => ensureValid(smiles, smileId, setSmileId), [
    smiles,
    smileId,
    ensureValid,
  ]);

  const handleEditSave = useCallback(() => {
    setEdit(false);
  }, []);

  const handleEditToggle = useCallback(() => {
    setEdit((v) => !v);
  }, []);

  return (
    <div className="">
      <div className="mb-4">
        {t(
          "Your audio has been successfully generated. You may further customize it or simply download it for use."
        )}
      </div>
      <AudioPlayer edit={edit} onSave={handleEditSave} />
      <div className="flex flex-wrap">
        <Actions
          className="mr-4 mt-4 md:w-[calc(50%-0.5rem)] md:mr-2"
          title={t("Exporting 1 audio")}
          classButton="btn-dark md:w-full"
          classTitle="pl-3"
          buttonInner={
            <>
              <span>{t("Export")}</span>
              <Icon name="share" aria-hidden="true" />
            </>
          }
        >
          <Export />
        </Actions>
        <button
          type="button"
          className="btn-white btn-small mr-4 mt-4 md:w-[calc(50%-0.5rem)] md:mr-0 md:ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
          onClick={handleEditToggle}
          aria-pressed={edit}
          aria-label={edit ? t("Stop editing") : t("Edit")}
        >
          <span>{edit ? t("Done") : t("Edit")}</span>
          <Icon name="edit" aria-hidden="true" />
        </button>
        <Select
          className="mr-4 mt-4 md:w-full md:mr-0"
          items={languages}
          value={language}
          onChange={(item) => setLanguageId(String(item.id))}
          small
          up
        />
        <Select
          className="mr-4 mt-4 md:w-full md:mr-0"
          title={t("Speed")}
          items={speeds}
          value={speed}
          onChange={(item) => setSpeedId(String(item.id))}
          small
          up
        />
        <div className="flex mr-4 mt-4 rounded-md shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.15)] bg-n-1 md:w-full md:mr-0 dark:bg-n-6 dark:shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.15),inset_0_0_0_0.0625rem_rgba(254,254,254,.1)]">
          <Select
            classButton="shadow-none bg-transparent ui-open:shadow-none dark:bg-transparent dark:shadow-none"
            title={t("Voice")}
            items={genders}
            value={gender}
            onChange={(item) => setGenderId(String(item.id))}
            small
            up
          />
          <div className="self-center w-0.25 h-6 bg-n-3 dark:bg-n-4/50"></div>
          <Select
            classButton="shadow-none bg-transparent ui-open:shadow-none dark:bg-transparent dark:shadow-none"
            icon="volume"
            className=""
            items={voices}
            value={voice}
            onChange={(item) => setVoiceId(String(item.id))}
            small
            up
          />
        </div>
        <Select
          className="mr-4 mt-4 md:w-full md:mr-0"
          items={smiles}
          value={smile}
          onChange={(item) => setSmileId(String(item.id))}
          small
          up
        />
      </div>
    </div>
  );
};

export default Audio;
