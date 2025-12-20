// ============================================================================
// 👤 Profile Switch – LoggedIn vs LoggedOut (Health-grade Session UI)
// Datei: components/RightSidebar/Profile/index.tsx
// Version: v2.0 – 2025-12-20
//
// Ziel:
// - Nach Logout sofort UI-Switch (ohne Full Refresh)
// - Single Source of Truth: useAuth() wird NUR hier verwendet
// - refresh() wird als Prop nach unten gereicht (keine doppelte Hook-Instanz)
// ============================================================================

"use client";

import { useAuth } from "@/hooks/useAuth";
import ProfileLoggedIn from "./ProfileLoggedIn";
import ProfileLoggedOut from "./ProfileLoggedOut";

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const { user, isAuthenticated, isLoading, refresh } = useAuth();

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
    <ProfileLoggedIn user={user ?? undefined} refreshAuth={refresh} />
  ) : (
    <ProfileLoggedOut />
  );
};

export default Profile;
