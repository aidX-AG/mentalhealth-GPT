// ============================================================================
// 👤 Profile Switch – LoggedIn vs LoggedOut (Health-grade Session UI)
// Datei: components/RightSidebar/Profile/index.tsx
// Version: v1.0 – 2025-12-18
//
// Ziel:
// - Nach Login automatisch Avatar-Menü anzeigen
// - Kein Fake-State (kein isAuthenticated useState im UI)
// - Static-export-safe: Client fetch direkt gegen API /auth/me
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

  // Health-Guard: Auth=true aber kein User-Objekt => UI bleibt stabil
  if (isAuthenticated && !user) {
    return <ProfileLoggedOut />;
  }

  return isAuthenticated ? (
    <ProfileLoggedIn user={user ?? undefined} />
  ) : (
    <ProfileLoggedOut />
  );
};

export default Profile;
