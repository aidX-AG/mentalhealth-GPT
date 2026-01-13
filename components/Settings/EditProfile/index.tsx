import React, { useEffect, useState } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import { getT } from "@/lib/i18n-runtime";
import { encryptAesGcm, generateDEK, toBase64Url } from "@/lib/crypto/aesgcm";

const t = getT();

type EditProfileProps = {};

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const EditProfile = ({}: EditProfileProps) => {
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const [avatarErrorKey, setAvatarErrorKey] = useState<string>("");
  const [isEncryptingAvatar, setIsEncryptingAvatar] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("Sai Gon, Vietnam");
  const [bio, setBio] = useState<string>("");

  // Avoid memory leaks when users select multiple avatars
  useEffect(() => {
    return () => {
      if (objectURL && objectURL.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(objectURL);
        } catch {
          // ignore
        }
      }
    };
  }, [objectURL]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarErrorKey("");

    const file = e.target.files?.[0];
    if (!file) return;

    // ---- Health-grade input validation (client-side) ----
    if (!ALLOWED_MIME.has(file.type)) {
      setAvatarErrorKey("settings.edit-profile.avatar.error.type");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarErrorKey("settings.edit-profile.avatar.error.size");
      e.target.value = "";
      return;
    }

    // Keep existing preview behavior
    if (objectURL && objectURL.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(objectURL);
      } catch {
        // ignore
      }
    }
    setObjectURL(URL.createObjectURL(file));

    // ---- Local encryption test (NO upload yet) ----
    try {
      setIsEncryptingAvatar(true);

      const plaintext = await file.arrayBuffer();
      const dek = generateDEK();

      try {
        // AAD: context-binding (temporary for local test).
        // In real upload flow: tenant|user|object_type|object_key|version
        const aadText = "mhgpt|me|avatar|local-preview";

        const enc = await encryptAesGcm(plaintext, dek, aadText);

        // Debug only: do not persist DEK/ciphertext.
        // eslint-disable-next-line no-console
        console.log("avatar encrypt ok", {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          cipherSize: enc.ciphertext.byteLength,
          iv_b64u: enc.iv_b64u,
          aad_b64u: enc.aad_b64u,
          dek_b64u: toBase64Url(dek),
          alg: enc.alg,
        });
      } finally {
        // Best-effort zeroization (defense in depth; JS cannot guarantee perfect wiping)
        // eslint-disable-next-line no-unused-expressions
        dek.fill(0);
      }

      setIsEncryptingAvatar(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("avatar encrypt failed", err);
      setIsEncryptingAvatar(false);
      setAvatarErrorKey("settings.edit-profile.avatar.error.encrypt_failed");
    }
  };

  return (
    <form className="" action="" onSubmit={() => console.log("Submit")}>
      <div className="mb-8 h4 md:mb-6">{t("settings.edit-profile.title")}</div>

      <div className="mb-3 base2 font-semibold text-n-6 dark:text-n-1">
        {t("settings.edit-profile.avatar.label")}
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex justify-center items-center shrink-0 w-28 h-28 mr-4 rounded-full overflow-hidden bg-n-2 dark:bg-n-6">
          {objectURL !== null ? (
            <Image
              className="object-cover rounded-full"
              src={objectURL}
              fill
              alt={t("settings.edit-profile.avatar.alt")}
            />
          ) : (
            <Icon className="w-8 h-8 dark:fill-n-1" name="profile" />
          )}
        </div>

        <div className="grow">
          <div className="relative inline-flex mb-4">
            <input
              className="peer absolute inset-0 opacity-0 cursor-pointer"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleUpload}
            />
            <button
              type="button"
              className="btn-stroke-light peer-hover:bg-n-3 dark:peer-hover:bg-n-5"
              disabled={isEncryptingAvatar}
              aria-busy={isEncryptingAvatar}
            >
              {isEncryptingAvatar
                ? t("settings.edit-profile.avatar.encrypting")
                : t("settings.edit-profile.avatar.upload")}
            </button>
          </div>

          {avatarErrorKey ? (
            <div className="caption1 text-accent-1 mb-2">
              {t(avatarErrorKey)}
            </div>
          ) : null}

          <div className="caption1 text-n-4">
            <p>{t("settings.edit-profile.avatar.hint.resolution")}</p>
            <p>{t("settings.edit-profile.avatar.hint.types")}</p>
          </div>
        </div>
      </div>

      <Field
        className="mb-6"
        label={t("settings.edit-profile.name.label")}
        placeholder={t("settings.edit-profile.name.placeholder")}
        icon="profile-1"
        value={name}
        onChange={(e: any) => setName(e.target.value)}
        required
      />

      <Field
        className="mb-6"
        label={t("settings.edit-profile.location.label")}
        placeholder={t("settings.edit-profile.location.placeholder")}
        icon="marker"
        value={location}
        onChange={(e: any) => setLocation(e.target.value)}
        required
      />

      <Field
        className="mb-6"
        label={t("settings.edit-profile.bio.label")}
        placeholder={t("settings.edit-profile.bio.placeholder")}
        icon="user-check"
        value={bio}
        onChange={(e: any) => setBio(e.target.value)}
        textarea
        required
      />

      <button className="btn-blue w-full">
        {t("settings.edit-profile.save")}
      </button>
    </form>
  );
};

export default EditProfile;
