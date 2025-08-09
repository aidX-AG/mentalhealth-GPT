import Member from "./Member";

import { members } from "@/mocks/members";
import i18next from "i18next";

type TeamProps = {};

const Team = ({}: TeamProps) => (
    <>
        <div className="flex items-center mb-8 md:mb-6">
            <div className="mr-auto h4">{i18next.t("common.sections.members", { defaultValue: "Members" })}</div>
            <button className="btn-blue">{i18next.t("common.sections.invite", { defaultValue: "Invite" })}</button>
        </div>
        <div className="py-3 base2 text-n-4">{i18next.t("common.fragments.members-count", { defaultValue: "42 members" })}</div>
        <div className="mb-6">
            {members.map((member, index) => (
                <Member
                    item={member}
                    key={member.id}
                    style={{ zIndex: members.length - index }}
                />
            ))}
        </div>
    </>
);

export default Team;
