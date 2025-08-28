import Link from "next/link";
import Application from "./Application";
import { applications } from "@/mocks/applications";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type ApplicationsProps = {};
const Applications = ({}: ApplicationsProps) => <>
        <div className="flex items-center mb-8">
            <div className="mr-auto h4">{t("Applications")}</div>
            <Link className="btn-blue" href="/applications">{t("Add apps")}</Link>
        </div>
        <div className="py-3 base2 text-n-4">{t("Authorized apps")}</div>
        <div className="mb-6">
            {applications.filter((x: any) => x.installed === true).map(application => <Application item={application} key={application.id} />)}
        </div>
    </>;
export default Applications;