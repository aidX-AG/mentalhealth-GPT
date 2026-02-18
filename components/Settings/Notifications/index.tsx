import { useState, useCallback, useMemo, useEffect } from "react";
import Switch from "@/components/Switch";
import Checkbox from "@/components/Checkbox";
import { useI18n } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Notifications Settings
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - No side-effects in useMemo (useEffect for resync)
 * - No sensitive logging
 * - Stable IDs preserve user choices across locale changes
 * ============================================================================
 */

type CheckboxItem = {
  id: string;
  title: string;
  isChecked: boolean;
};

type CheckboxGroup = {
  id: string;
  title: string;
  checkboxs: CheckboxItem[];
};

type NotificationsProps = Record<string, never>;

const Notifications = ({}: NotificationsProps) => {
  const { locale, t } = useI18n();

  const [notifications, setNotifications] = useState<boolean>(true);

  const defaultGroups = useMemo<CheckboxGroup[]>(
    () => [
      {
        id: "platform",
        title: t("UI8 Platform"),
        checkboxs: [
          { id: "0", title: t("New notifications"), isChecked: true },
          { id: "1", title: t("Someone invite you to new chat"), isChecked: true },
          { id: "2", title: t("Mentioned"), isChecked: true },
        ],
      },
      {
        id: "team",
        title: t("From team"),
        checkboxs: [
          { id: "0", title: t("New notifications"), isChecked: false },
          { id: "1", title: t("Someone invite you to new chat"), isChecked: false },
          { id: "2", title: t("Mentioned"), isChecked: true },
        ],
      },
      {
        id: "app",
        title: t("From Brainwave app"),
        checkboxs: [{ id: "0", title: t("Mentioned"), isChecked: true }],
      },
    ],
    [locale, t]
  );

  const [checkboxes, setCheckboxes] = useState<CheckboxGroup[]>(defaultGroups);

  // ✅ Re-sync when locale changes (titles update) while preserving isChecked
  useEffect(() => {
    setCheckboxes((prev) => {
      return defaultGroups.map((newGroup) => {
        const oldGroup = prev.find((g) => g.id === newGroup.id);
        if (!oldGroup) return newGroup;

        return {
          ...newGroup,
          checkboxs: newGroup.checkboxs.map((newCb) => {
            const oldCb = oldGroup.checkboxs.find((c) => c.id === newCb.id);
            return {
              ...newCb,
              isChecked: oldCb?.isChecked ?? newCb.isChecked,
            };
          }),
        };
      });
    });
  }, [defaultGroups]);

  const handleCheckboxChange = useCallback((groupId: string, checkboxId: string) => {
    setCheckboxes((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          checkboxs: group.checkboxs.map((checkbox) =>
            checkbox.id === checkboxId
              ? { ...checkbox, isChecked: !checkbox.isChecked }
              : checkbox
          ),
        };
      })
    );
  }, []);

  const handleNotificationsChange = useCallback((value: boolean) => {
    setNotifications(value);
    setCheckboxes((prev) =>
      prev.map((group) => ({
        ...group,
        checkboxs: group.checkboxs.map((checkbox) => ({
          ...checkbox,
          isChecked: value,
        })),
      }))
    );
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement save (no logging)
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center mb-8">
        <div className="mr-auto h4">{t("Notifications")}</div>

        {/* If Switch supports aria-label, keep it (recommended) */}
        <Switch value={notifications} setValue={handleNotificationsChange} />
      </div>

      <div>
        {checkboxes.map((group) => (
          <div
            className="mb-8 border-t border-n-3 py-6 last:mb-0 dark:border-n-6"
            key={group.id}
          >
            <div className="mb-4 h6">{group.title}</div>

            {group.checkboxs.map((checkbox) => (
              <Checkbox
                className="mb-4 last:mb-0"
                label={checkbox.title}
                key={`${group.id}:${checkbox.id}`}
                checked={checkbox.isChecked}
                onCheckedChange={() => handleCheckboxChange(group.id, checkbox.id)}
                reverse
              />
            ))}
          </div>
        ))}
      </div>
    </form>
  );
};

export default Notifications;
