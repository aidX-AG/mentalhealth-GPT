import Link from "next/link";
import Application from "./Application";
import { applications } from "@/mocks/applications";
import { useTranslation } from "@/lib/i18n/I18nContext";

type ApplicationType = {
  id: string;
  installed: boolean;
  [key: string]: unknown;
};

type ApplicationsProps = Record<string, never>;

const Applications = ({}: ApplicationsProps) => {
  const t = useTranslation();

  const installedApps = applications.filter(
    (app): app is ApplicationType =>
      (app as ApplicationType).installed === true
  );

  return (
    <>
      <div className="flex items-center mb-8">
        <div className="mr-auto h4">{t("Applications")}</div>
        <Link className="btn-blue" href="/applications">
          {t("Add apps")}
        </Link>
      </div>
      <div className="py-3 base2 text-n-4">{t("Authorized apps")}</div>
      <div className="mb-6">
        {installedApps.map((application) => (
          <Application item={application} key={application.id} />
        ))}
      </div>
    </>
  );
};

export default Applications;
