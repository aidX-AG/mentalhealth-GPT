import Member from "./Member";
import { members } from "@/mocks/members";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Team
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - i18n-safe member count (no hardcoded numbers)
 * - Accessible invite action
 * ============================================================================
 */

type TeamProps = Record<string, never>;

const Team = ({}: TeamProps) => {
  const t = useTranslation();

  const memberCount = members.length;

  return (
    <>
      <div className="flex items-center mb-8 md:mb-6">
        <div className="mr-auto h4">{t("Members")}</div>

        <button
          type="button"
          className="btn-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
          aria-label={t("Invite member")}
        >
          {t("Invite")}
        </button>
      </div>

      <div className="py-3 base2 text-n-4">
        {t("Members")}: {memberCount}
      </div>

      <div className="mb-6">
        {members.map((member, index) => (
          <Member
            item={member}
            key={member.id}
            style={{ zIndex: memberCount - index }}
          />
        ))}
      </div>
    </>
  );
};

export default Team;
