import Link from "next/link";
import Image from "@/components/Image";
import i18next from "i18next";

type ProfileProps = {
    visible?: boolean;
};

const Profile = ({ visible }: ProfileProps) => (
    <div
        className={`${
            visible
                ? "mb-6"
                : "mb-3 shadow-[0_1.25rem_1.5rem_0_rgba(0,0,0,0.5)]"
        }`}
    >
        <div className={`${!visible && "p-2.5 bg-n-6 rounded-xl"}`}>
            <div
                className={`flex items-center ${
                    visible ? "justify-center" : "px-2.5 py-2.5 pb-4.5"
                }`}
            >
                <div className="relative w-10 h-10">
                    <Image
                        className="rounded-full object-cover"
                        src="/images/avatar.jpg"
                        fill
                        alt={i18next.t("common.imagealt_avatar_05", { defaultValue: "Avatar" })}
                    />
                    <div className="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 bg-primary-2 rounded-full border-4 border-n-6"></div>
                </div>
                {!visible && (
                    <>
                        <div className="ml-4 mr-4">
                            <div className="base2 font-semibold text-n-1">
                                {i18next.t("common.div_tran_mau_tri_tam_01", { defaultValue: "Tran Mau Tri Tam" })}</div>
                            <div className="caption1 font-semibold text-n-3/50">
                                {i18next.t("common.div_tamui8net_02", { defaultValue: "tam@ui8.net" })}</div>
                        </div>
                        <div className="shrnik-0 ml-auto self-start px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-7">
                            {i18next.t("common.fragment_free_03", { defaultValue: "Free" })}</div>
                    </>
                )}
            </div>
            {!visible && (
                <Link className="btn-stroke-dark w-full mt-2" href="/pricing">
                    {i18next.t("common.node_upgraded_to_pro_04", { defaultValue: "Upgraded to Pro" })}</Link>
            )}
        </div>
    </div>
);

export default Profile;
