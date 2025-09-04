// components/LeftSidebar/Profile/index.tsx
// --------------------------------------------------------------------------
// [profile-lang-switcher] v1.0.4 — 2025-09-04
// CHANGELOG:
// - v1.0.4: LangSwitcher erhält prop `stack` abhängig von `visible`,
//           damit die Buttons im kollabierten Zustand vertikal gestapelt sind.
//           Sonst NICHTS geändert.
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
        {/* EINZIGE Änderung: stack abhängig vom Sidebar-Status */}
        <LangSwitcher stack={!!visible} />
      </div>
    </div>
  </div>
);

export default Profile;
