// components/LeftSidebar/Profile/index.tsx
// --------------------------------------------------------------------------
// [profile-lang-switcher] v1.0.2 — 2025-09-02
// CHANGELOG:
// - v1.0.2: Ersetzt den "Upgrade to Pro"-Button durch den EXISTIERENDEN
//           <LangSwitcher /> (DE / FR / EN) – identisch zur Topbar-Version.
//           Sonst absolut nichts geändert.
// --------------------------------------------------------------------------

import Link from "next/link";
import Image from "@/components/Image";
import { getT } from "@/lib/i18n-runtime";
const t = getT();

// [NEU] exakt derselbe Switcher wie oben rechts
import LangSwitcher from "@/components/LangSwitcher";

type ProfileProps = {
  visible?: boolean;
};

const Profile = ({
  visible
}: ProfileProps) => (
  <div className={`${visible ? "mb-6" : "mb-3 shadow-[0_1.25rem_1.5rem_0_rgba(0,0,0,0.5)]"}`}>
    <div className={`${!visible && "p-2.5 bg-n-6 rounded-xl"}`}>
      <div className={`flex items-center ${visible ? "justify-center" : "px-2.5 py-2.5 pb-4.5"}`}>
        <div className="relative w-10 h-10">
          <Image className="rounded-full object-cover" src="/images/avatar.jpg" fill alt={t("Avatar")} />
          <div className="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 bg-primary-2 rounded-full border-4 border-n-6"></div>
        </div>
        {!visible && <>
          <div className="ml-4 mr-4">
            <div className="base2 font-semibold text-n-1">{t("WIP")}</div>
            <div className="caption1 font-semibold text-n-3/50">{t("hello@aidx.ch")}</div>
          </div>
          <div className="shrnik-0 ml-auto self-start px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-7">{t("Free")}</div>
        </>}
      </div>

      {/* [GEÄNDERT] exakt derselbe Switcher wie oben rechts; ersetzt den Upgrade-Button */}
      {!visible && (
        <div className="w-full mt-2">
          <LangSwitcher />
        </div>
      )}
    </div>
  </div>
);

export default Profile;
