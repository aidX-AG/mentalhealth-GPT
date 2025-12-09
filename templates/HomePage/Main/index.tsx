"use client";

import { useState } from "react";
import Message from "@/components/Message";
import Menu from "@/components/Menu";
import { useSession } from "@/hooks/useSession";

type NavItem = {
  title: string;
  icon: string;
  color: string;
  url: string;
};

type MainProps = {
  heroTitle: string;
  heroSubtitle: string;
  items: NavItem[];
  inputPlaceholder?: string;
  /**
   * Optional: Custom-Handler vom Page-Level,
   * z.B. um ein Sign-In Modal zu öffnen statt Redirect.
   */
  onRequireLogin?: () => void;
  onRequireSubscription?: () => void;
};

const Main = ({
  heroTitle,
  heroSubtitle,
  items,
  inputPlaceholder = "Ask mentalhealthGPT anything",
  onRequireLogin,
  onRequireSubscription,
}: MainProps) => {
  const [message, setMessage] = useState<string>("");

  // 🔐 Health-Grade Session-State aus dem Hook
  const {
    isAuthenticated,
    isLoading,
    error,
    subscriptionStatus,
    planType,
    remainingFreePrompts,
  } = useSession() as any; // Typen liegen zentral im Hook

  // Hat der User ein aktives oder trial Abo?
  const hasSubscription =
    subscriptionStatus === "active" || subscriptionStatus === "trial";

  // ✅ Darf der User aktuell einen Prompt schicken?
  // - Nicht eingeloggt   → nein
  // - Ohne Abo           → nur wenn noch freie Prompts
  // - Mit Abo (Starter/Pro/Institution/Founding) → ja
  //   (Monthly-Limits erzwingt das Backend in /chat)
  const canSendPrompt =
    !!isAuthenticated &&
    (hasSubscription ||
      (typeof remainingFreePrompts === "number" &&
        remainingFreePrompts > 0));

  // ✅ Darf der User Upload nutzen?
  // - Nur mit Abo (Starter inkl. Founding, Pro, Institution)
  //   → konkrete Monats-Limits erzwingt das Backend in /upload
  const canUpload = !!isAuthenticated && hasSubscription;

  // Fallbacks für Login-/Abo-Aktion (Option B – Page kann überschreiben)
  const handleRequireLogin = () => {
    if (onRequireLogin) {
      onRequireLogin();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
  };

  const handleRequireSubscription = () => {
    if (onRequireSubscription) {
      onRequireSubscription();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = "/pricing";
    }
  };

  return (
    <>
      <div className="grow px-10 py-20 overflow-y-auto scroll-smooth scrollbar-none 2xl:py-12 md:px-4 md:pt-0 md:pb-6">
        <div className="mb-10 text-center">
          <div className="h3 leading-[4rem] 2xl:mb-2 2xl:h4">
            {heroTitle}
          </div>
          <div className="body1 text-n-4 2xl:body1S">
            {heroSubtitle}
          </div>
        </div>
        <Menu className="max-w-[30.75rem] mx-auto" items={items} />
      </div>

      <Message
        value={message}
        onChange={(e: any) => setMessage(e.target.value)}
        placeholder={inputPlaceholder}
        // 🔐 Gating-Infos (Option B)
        isAuthenticated={isAuthenticated}
        isSessionLoading={isLoading}
        canSend={canSendPrompt}
        canUpload={canUpload}
        remainingFreePrompts={
          typeof remainingFreePrompts === "number"
            ? remainingFreePrompts
            : 0
        }
        subscriptionStatus={subscriptionStatus}
        planType={planType}
        onRequireLogin={handleRequireLogin}
        onRequireSubscription={handleRequireSubscription}
        sessionError={error}
      />
    </>
  );
};

export default Main;
