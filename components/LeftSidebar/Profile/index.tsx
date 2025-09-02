// components/LeftSidebar/Profile/index.tsx
// --------------------------------------------------------------------------
// [profile-lang-switcher] v1.0.3 — 2025-09-02
// CHANGELOG:
// - v1.0.3: Nur <LangSwitcher /> anzeigen und zentrieren.
//           Avatar/Email/Badge komplett entfernt. Sonst nichts geändert.
// --------------------------------------------------------------------------

import LangSwitcher from "@/components/LangSwitcher";

type ProfileProps = {
  visible?: boolean;
};

const Profile = ({ visible }: ProfileProps) => (
  <div className={`${visible ? "mb-6" : "mb-3 shadow-[0_1.25rem_1.5rem_0_rgba(0,0,0,0.5)]"}`}>
    <div className={`${!visible && "p-2.5 bg-n-6 rounded-xl"}`}>
      {/* Switcher exakt wie bisher, nur zentriert */}
      <div className={`w-full ${!visible ? "mt-2" : ""} flex justify-center`}>
        <LangSwitcher />
      </div>
    </div>
  </div>
);

export default Profile;
