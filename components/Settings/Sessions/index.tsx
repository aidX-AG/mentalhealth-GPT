import Device from "./Device";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
const devices = [{
  id: "0",
  title: t("Chrome on iPhone"),
  image: "/images/chrome.svg",
  address: "222.225.225.222",
  date: t("Signed in Nov 17, 2023")
}, {
  id: "1",
  title: t("Chrome on Macbook Pro"),
  image: "/images/chrome.svg",
  address: "222.225.225.222",
  date: t("Signed in Nov 17, 2023")
}, {
  id: "2",
  title: t("Safari on Macbook Pro"),
  image: "/images/safari.svg",
  address: "222.225.225.222",
  date: t("Signed in Nov 17, 2023")
}];
type SessionsProps = {};
const Sessions = ({}: SessionsProps) => <>
        <div className="mb-8 h4 md:mb-6">{t("Your sessions")}</div>
        <div className="mb-8 base2 text-n-4 md:mb-6">{t("This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.")}</div>
        <div className="py-3 base2 text-n-4">{t("Devices")}</div>
        <div className="mb-6">
            {devices.map(device => <Device item={device} key={device.id} />)}
        </div>
        <button className="btn-blue w-full">{t("Sign out all devices")}</button>
    </>;
export default Sessions;