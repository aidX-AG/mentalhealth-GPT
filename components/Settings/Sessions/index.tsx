import Device from "./Device";
import i18next from "i18next";

const devices = [
    {
        id: "0",
        title: "Chrome on iPhone",
        image: "/images/chrome.svg",
        address: "222.225.225.222",
        date: "Signed in Nov 17, 2023",
    },
    {
        id: "1",
        title: "Chrome on Macbook Pro",
        image: "/images/chrome.svg",
        address: "222.225.225.222",
        date: "Signed in Nov 17, 2023",
    },
    {
        id: "2",
        title: "Safari on Macbook Pro",
        image: "/images/safari.svg",
        address: "222.225.225.222",
        date: "Signed in Nov 17, 2023",
    },
];

type SessionsProps = {};

const Sessions = ({}: SessionsProps) => (
    <>
        <div className="mb-8 h4 md:mb-6">{i18next.t("common.fragment_your_sessions_01", { defaultValue: "Your sessions" })}</div>
        <div className="mb-8 base2 text-n-4 md:mb-6">
            {i18next.t("common.fragment_this_is_a_list_of_02", { defaultValue: "This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize." })}</div>
        <div className="py-3 base2 text-n-4">{i18next.t("common.fragment_devices_03", { defaultValue: "Devices" })}</div>
        <div className="mb-6">
            {devices.map((device) => (
                <Device item={device} key={device.id} />
            ))}
        </div>
        <button className="btn-blue w-full">{i18next.t("common.fragment_sign_out_all_devices_04", { defaultValue: "Sign out all devices" })}</button>
    </>
);

export default Sessions;
