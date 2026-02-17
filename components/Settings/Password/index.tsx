import { useState, useCallback, useMemo } from "react";
import Field from "@/components/Field";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Password Settings Form
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - No sensitive logging
 * - Client-side validation (match + min length)
 * - Safer UX (disable submit while invalid/submitting)
 * ============================================================================
 */

type PasswordProps = Record<string, never>;

const MIN_PASSWORD_LENGTH = 8;

const Password = ({}: PasswordProps) => {
  const t = useTranslation();

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOldPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value),
    []
  );

  const handleNewPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value),
    []
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setConfirmPassword(e.target.value),
    []
  );

  const validationError = useMemo(() => {
    if (!newPassword && !confirmPassword) return null;

    if (newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH) {
      return t("Password must be at least 8 characters");
    }

    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      return t("Passwords do not match");
    }

    return null;
  }, [newPassword, confirmPassword, t]);

  const canSubmit = useMemo(() => {
    return (
      !isSubmitting &&
      oldPassword.trim().length > 0 &&
      newPassword.length >= MIN_PASSWORD_LENGTH &&
      confirmPassword.length >= MIN_PASSWORD_LENGTH &&
      newPassword === confirmPassword
    );
  }, [oldPassword, newPassword, confirmPassword, isSubmitting]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Hard stop if invalid (defense-in-depth)
      if (!canSubmit) {
        setError(validationError ?? t("Please check your inputs"));
        return;
      }

      setIsSubmitting(true);
      try {
        // TODO: call API (never log passwords)
        // await api.post("/v1/account/change-password", { oldPassword, newPassword });

        // Optional: clear fields on success
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch {
        // Avoid leaking details (security-friendly)
        setError(t("Password change failed. Please try again."));
      } finally {
        setIsSubmitting(false);
      }
    },
    [canSubmit, validationError, t]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 h4 md:mb-6">{t("Password")}</div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-accent-1/10 text-accent-1 base2">
          {error}
        </div>
      )}

      <Field
        className="mb-6"
        label={t("Current password")}
        placeholder={t("Current password")}
        type="password"
        icon="lock"
        value={oldPassword}
        onChange={handleOldPasswordChange}
        required
        autoComplete="current-password"
      />

      <Field
        className="mb-6"
        label={t("New password")}
        placeholder={t("New password")}
        note={t("Minimum 8 characters")}
        type="password"
        icon="lock"
        value={newPassword}
        onChange={handleNewPasswordChange}
        required
        autoComplete="new-password"
      />

      <Field
        className="mb-6"
        label={t("Confirm new password")}
        placeholder={t("Confirm new password")}
        note={validationError ?? t("Minimum 8 characters")}
        type="password"
        icon="lock"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        required
        autoComplete="new-password"
      />

      <button
        type="submit"
        className="btn-blue w-full"
        disabled={!canSubmit}
        aria-disabled={!canSubmit}
      >
        {isSubmitting ? t("Saving...") : t("Change password")}
      </button>
    </form>
  );
};

export default Password;
