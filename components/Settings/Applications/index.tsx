import Link from "next/link";
import Application from "./Application";

import { applications } from "@/mocks/applications";
import i18next from "i18next";

type ApplicationsProps = {};

const Applications = ({}: ApplicationsProps) => (
    <>
        <div className="flex items-center mb-8">
            <div className="mr-auto h4">{i18next.t("common.sections.applications", { defaultValue: "Applications" })}</div>
            <Link className="btn-blue" href="/applications">
                {i18next.t("common.sections.add-apps", { defaultValue: "Add apps" })}</Link>
        </div>
        <div className="py-3 base2 text-n-4">{i18next.t("common.fragments.authorized-apps", { defaultValue: "Authorized apps" })}</div>
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
