// ============================================================================
// 👤 Profile Switch – LoggedIn vs LoggedOut (Health-grade Session UI)
// Datei: components/RightSidebar/Profile/index.tsx
// Version: v1.1 – 2025-12-20
//
// Ziel:
// - Nach Login automatisch Avatar-Menü anzeigen
// - Kein Fake-State (kein isAuthenticated useState im UI)
// - Static-export-safe: Client fetch direkt gegen API /auth/me
//
// Logout-Erfordernis (wichtig):
// - UI muss NUR dem Hook-State folgen (isAuthenticated)
// - user darf NICHT als Gatekeeper dienen (sonst "Logout erst nach Refresh")
// ============================================================================

"use client";

import { useAuth } from "@/hooks/useAuth";
import ProfileLoggedIn from "./ProfileLoggedIn";
import ProfileLoggedOut from "./ProfileLoggedOut";

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // minimaler Skeleton: hält Layout stabil
    return (
      <div className="relative z-10 mr-8 lg:mr-6 md:static">
        <div className="w-10 h-10 rounded-full bg-n-3/60 dark:bg-n-5/50" />
      </div>
    );
  }

  // ✅ Logout-robust: Entscheidung basiert NUR auf isAuthenticated.
  // user kann beim Umschalten kurz null/alt sein → darf UI nicht blockieren.
  return isAuthenticated ? (
    <ProfileLoggedIn user={user ?? undefined} />
  ) : (
    <ProfileLoggedOut />
  );
};

export default Profile;
