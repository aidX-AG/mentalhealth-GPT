import { useMemo } from "react";
import Device from "./Device";
import { useI18n } from "@/lib/i18n/I18nContext";

type DeviceItem = {
  id: string;
  title: string;
  image: string;
  address: string;
  date: string;
};

type SessionsProps = Record<string, never>;

const Sessions = ({}: SessionsProps) => {
  const { locale, t } = useI18n();

  const devices: DeviceItem[] = useMemo(
    () => [
      {
        id: "chrome-iphone",
        title: t("Chrome on iPhone"),
        image: "/images/chrome.svg",
        address: "222.225.225.222",
        date: t("Signed in Nov 17, 2023"),
      },
      {
        id: "chrome-mac",
        title: t("Chrome on Macbook Pro"),
        image: "/images/chrome.svg",
        address: "222.225.225.222",
        date: t("Signed in Nov 17, 2023"),
      },
      {
        id: "safari-mac",
        title: t("Safari on Macbook Pro"),
        image: "/images/safari.svg",
        address: "222.225.225.222",
        date: t("Signed in Nov 17, 2023"),
      },
    ],
    [locale, t]
  );

  return (
    <>
      <div className="mb-8 h4 md:mb-6">{t("Your sessions")}</div>
      <div className="mb-8 base2 text-n-4 md:mb-6">
        {t(
          "This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize."
        )}
      </div>
      <div className="py-3 base2 text-n-4">{t("Devices")}</div>
      <div className="mb-6">
        {devices.map((device) => (
          <Device item={device} key={device.id} />
        ))}
      </div>
      <button
        type="button"
        className="btn-blue w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
      >
        {t("Sign out all devices")}
      </button>
    </>
  );
};

export default Sessions;
