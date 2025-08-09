import { useState } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import i18next from "i18next";

type EditProfileProps = {};

const EditProfile = ({}: EditProfileProps) => {
    const [objectURL, setObjectURL] = useState<any>("/images/avatar.jpg");
    const [name, setName] = useState<string>("");
    const [location, setLocation] = useState<string>("Sai Gon, Vietnam");
    const [bio, setBio] = useState<string>("");

    const handleUpload = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // setImage(file);
            setObjectURL(URL.createObjectURL(file));
        }
    };

    return (
        <form className="" action="" onSubmit={() => console.log("Submit")}>
            <div className="mb-8 h4 md:mb-6">{i18next.t("common.form.edit-profile", { defaultValue: "Edit profile" })}</div>
            <div className="mb-3 base2 font-semibold text-n-6 dark:text-n-1">
                {i18next.t("common.form.avatar", { defaultValue: "Avatar" })}</div>
            <div className="flex items-center mb-6">
                <div className="relative flex justify-center items-center shrink-0 w-28 h-28 mr-4 rounded-full overflow-hidden bg-n-2 dark:bg-n-6">
                    {objectURL !== null ? (
                        <Image
                            className="object-cover rounded-full"
                            src={objectURL}
                            fill
                            alt={i18next.t("common.alt.avatar", { defaultValue: "Avatar" })}
                        />
                    ) : (
                        <Icon
                            className="w-8 h-8 dark:fill-n-1"
                            name="profile"
                        />
                    )}
                </div>
                <div className="grow">
                    <div className="relative inline-flex mb-4">
                        <input
                            className="peer absolute inset-0 opacity-0 cursor-pointer"
                            type="file"
                            onChange={handleUpload}
                        />
                        <button className="btn-stroke-light peer-hover:bg-n-3 dark:peer-hover:bg-n-5">
                            {i18next.t("common.form.upload-new-image", { defaultValue: "Upload new image" })}</button>
                    </div>
                    <div className="caption1 text-n-4">
                        <p>{i18next.t("common.form.size-recommendation", { defaultValue: "At least 800x800 px recommended." })}</p>
                        <p>{i18next.t("common.form.allowed-formats", { defaultValue: "JPG or PNG and GIF is allowed" })}</p>
                    </div>
                </div>
            </div>
            <Field
                className="mb-6"
                label={i18next.t("common.labels.name", { defaultValue: "Name" })}
                placeholder={i18next.t("common.placeholders.username", { defaultValue: "Username" })}
                icon="profile-1"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                label={i18next.t("common.labels.location", { defaultValue: "Location" })}
                placeholder={i18next.t("common.placeholders.location", { defaultValue: "Location" })}
                icon="marker"
                value={location}
                onChange={(e: any) => setLocation(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                label={i18next.t("common.labels.bio", { defaultValue: "Bio" })}
                placeholder={i18next.t("common.placeholders.short-bio", { defaultValue: "Short bio" })}
                icon="user-check"
                value={bio}
                onChange={(e: any) => setBio(e.target.value)}
                textarea
                required
            />
            <button className="btn-blue w-full">{i18next.t("common.form.save-changes", { defaultValue: "Save changes" })}</button>
        </form>
    );
};

export default EditProfile;
