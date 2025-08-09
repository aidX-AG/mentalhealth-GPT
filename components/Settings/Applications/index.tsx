import Link from "next/link";
import Application from "./Application";

import { applications } from "@/mocks/applications";
import i18next from "i18next";

type ApplicationsProps = {};

const Applications = ({}: ApplicationsProps) => (
    <>
        <div className="flex items-center mb-8">
            <div className="mr-auto h4">{i18next.t("common.div_applications_01", { defaultValue: "Applications" })}</div>
            <Link className="btn-blue" href="/applications">
                {i18next.t("common.div_add_apps_02", { defaultValue: "Add apps" })}</Link>
        </div>
        <div className="py-3 base2 text-n-4">{i18next.t("common.fragment_authorized_apps_03", { defaultValue: "Authorized apps" })}</div>
        <div className="mb-6">
            {applications
                .filter((x: any) => x.installed === true)
                .map((application) => (
                    <Application item={application} key={application.id} />
                ))}
        </div>
    </>
);

export default Applications;
