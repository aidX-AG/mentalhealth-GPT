import { useState, useMemo, useCallback } from "react";
import Field from "@/components/Field";
import Select from "@/components/Select";
import MultiSelect from "@/components/MultiSelect";
import User from "./User";
import { people } from "@/mocks/people";
import { useI18n } from "@/lib/i18n/I18nContext";

type AddChatListProps = {
  onCancel?: () => void;
};

// Falls people typisiert ist, bitte diesen Typ ersetzen durch den echten Export-Typ.
type PersonOption = (typeof people)[number];

type ColorItem = { id: string; title: string; color: string };
type AccessItem = { id: string; title: string };
type UserItem = { id: string; name: string; avatar: string; status?: string };

const AddChatList = ({ onCancel }: AddChatListProps) => {
  const { locale, t } = useI18n();

  const colors: ColorItem[] = useMemo(
    () => [
      { id: "violet", title: t("Chinese Violet"), color: "#8C6584" },
      { id: "blue", title: t("Dodger blue"), color: "#3E90F0" },
      { id: "orange", title: t("Golden Gate Bridge"), color: "#D84C10" },
      { id: "purple", title: t("Veronica"), color: "#8E55EA" },
      { id: "green", title: t("Sugus green"), color: "#7ECE18" },
    ],
    [locale, t]
  );

  const users: UserItem[] = useMemo(
    () => [
      {
        id: "me",
        name: t("Janiya (you)"),
        avatar: "/images/avatar.jpg",
        status: t("Full access"),
      },
      { id: "doug", name: t("Doug"), avatar: "/images/avatar-2.jpg" },
    ],
    [locale, t]
  );

  const typesAccess: AccessItem[] = useMemo(
    () => [
      { id: "full", title: t("Full access") },
      { id: "view", title: t("Can view") },
      { id: "chat", title: t("Can start chat") },
    ],
    [locale, t]
  );

  const defaultColor = useMemo(
    () => colors.find((c) => c.id === "blue") ?? colors[0],
    [colors]
  );
  const defaultAccess = useMemo(
    () => typesAccess.find((x) => x.id === "view") ?? typesAccess[0],
    [typesAccess]
  );

  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<ColorItem>(defaultColor);
  const [selectedOptions, setSelectedOptions] = useState<PersonOption[]>([]);
  const [typeAccess, setTypeAccess] = useState<AccessItem>(defaultAccess);

  // Wenn locale wechselt, Defaults stabil halten (optional, aber sauber)
  // -> nur setzen, wenn Nutzer noch nicht interagiert hat (name leer + nichts selected)
  // (Wenn du das nicht willst, einfach entfernen.)
  // useEffect(...) wäre hier möglich, aber ich lass's bewusst weg um es minimal zu halten.

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: create list
      console.log("[add-chat-list]", { name, color, selectedOptions, typeAccess });
    },
    [name, color, selectedOptions, typeAccess]
  );

  return (
    <form
      className="p-12 lg:px-8 md:pt-6 md:px-5 md:pb-6"
      onSubmit={handleSubmit}
    >
      <div className="mb-8 h4">{t("Add chat list")}</div>

      <div className="relative z-10 flex mb-8 md:block">
        <Field
          className="grow mr-3 md:mr-0 md:mb-3"
          label={t("Name")}
          placeholder={t("Name")}
          icon="chat-1"
          value={name}
          onChange={handleNameChange}
          required
        />

        <Select
          label={t("Color")}
          className="shrink-0 min-w-[14.5rem]"
          items={colors}
          value={color}
          onChange={(value) => value && setColor(value as ColorItem)}
        />
      </div>

      <div className="flex mb-2 base2 font-semibold">
        {t("Invite team member")}
      </div>

      <div className="mb-8 p-5 border border-n-3 rounded-xl md:p-0 md:border-none dark:border-n-5">
        <div className="relative z-5">
          <MultiSelect
            className="mb-4"
            classMultiSelectGlobal="multiselect-access"
            items={people}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />

          <Select
            className="!absolute top-1/2 right-4 -translate-y-1/2"
            classButton="h-auto px-0 !shadow-none caption1 font-semibold"
            classOptions="mt-5 left-auto -right-4 w-[10.125rem]"
            classOption="items-end caption1 font-semibold"
            items={typesAccess}
            value={typeAccess}
            onChange={setTypeAccess}
          />
        </div>

        <div className="mb-5 caption1 text-n-4/50">
          {t("Only people invited in this list can access")}
        </div>

        {users.map((user) => (
          <User item={user} key={user.id} />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="btn-stroke-light mr-3"
          onClick={onCancel}
          disabled={!onCancel}
          aria-disabled={!onCancel}
        >
          {t("Cancel")}
        </button>

        <button type="submit" className="btn-blue" disabled={!name.trim()}>
          {t("Add list")}
        </button>
      </div>
    </form>
  );
};

export default AddChatList;
