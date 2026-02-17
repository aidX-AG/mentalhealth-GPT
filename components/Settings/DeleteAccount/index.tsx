import { useState, useCallback } from "react";
import Field from "@/components/Field";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * DeleteAccount
 * Version: v1.1 – 2026-02-17
 * Security notes:
 * - Two-step confirmation reduces accidental destructive actions
 * - No logging of credentials or sensitive actions
 * - Busy-state prevents double submits
 * ============================================================================
 */

type DeleteAccountProps = Record<string, never>;

const DeleteAccount = ({}: DeleteAccountProps) => {
  const t = useTranslation();

  const [password, setPassword] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    []
  );

  const handleConfirmTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value),
    []
  );

  const canDelete =
    password.trim().length > 0 &&
    confirmText.trim().toUpperCase() === "DELETE" &&
    !isSubmitting;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canDelete) return;

      setIsSubmitting(true);
      try {
        // TODO: implement account deletion (server-side confirmation required)
        // - re-auth / verify password on server
        // - CSRF protection
        // - audit event (without storing password)
        // - irreversible delete + retention policy handling
      } finally {
        setIsSubmitting(false);
      }
    },
    [canDelete]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 h4">{t("We're sorry to see you go")}</div>

      <div className="mb-6 caption1 text-n-4" role="alert" aria-live="polite">
        {t(
          "Warning: Deleting your account will permanently remove all of your data and cannot be undone. This includes your profile, chats, comments, and any other information associated with your account. Are you sure you want to proceed with deleting your account?"
        )}
      </div>

      <Field
        className="mb-6"
        label={t("Your password")}
        placeholder={t("Password")}
        type="password"
        icon="lock"
        value={password}
        onChange={handlePasswordChange}
        required
        autoComplete="current-password"
      />

      <Field
        className="mb-6"
        label={t('Type "DELETE" to confirm')}
        placeholder="DELETE"
        type="text"
        value={confirmText}
        onChange={handleConfirmTextChange}
        required
        autoComplete="off"
      />

      <button
        type="submit"
        className="btn-red w-full"
        disabled={!canDelete}
        aria-disabled={!canDelete}
      >
        {isSubmitting ? t("Deleting…") : t("Delete account")}
      </button>
    </form>
  );
};

export default DeleteAccount;
