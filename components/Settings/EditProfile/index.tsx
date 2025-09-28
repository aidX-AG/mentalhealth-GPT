import { useState } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import { _ } from "@/lib/i18n/_";
const t = _;
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
  return <form className="" action="" onSubmit={() => console.log("Submit")}>
            <div className="mb-8 h4 md:mb-6">{t("Edit profile")}</div>
            <div className="mb-3 base2 font-semibold text-n-6 dark:text-n-1">{t("Avatar")}</div>
            <div className="flex items-center mb-6">
                <div className="relative flex justify-center items-center shrink-0 w-28 h-28 mr-4 rounded-full overflow-hidden bg-n-2 dark:bg-n-6">
                    {objectURL !== null ? <Image className="object-cover rounded-full" src={objectURL} fill alt={t("Avatar")} /> : <Icon className="w-8 h-8 dark:fill-n-1" name={t("profile")} />}
                </div>
                <div className="grow">
                    <div className="relative inline-flex mb-4">
                        <input className="peer absolute inset-0 opacity-0 cursor-pointer" type="file" onChange={handleUpload} />
                        <button className="btn-stroke-light peer-hover:bg-n-3 dark:peer-hover:bg-n-5">{t("Upload new image")}</button>
                    </div>
                    <div className="caption1 text-n-4">
                        <p>{t("At least 800x800 px recommended.")}</p>
                        <p>{t("JPG or PNG and GIF is allowed")}</p>
                    </div>
                </div>
            </div>
            <Field className="mb-6" label={t("Name")} placeholder={t("Username")} icon="profile-1" value={name} onChange={(e: any) => setName(e.target.value)} required />
            <Field className="mb-6" label={t("Location")} placeholder={t("Location")} icon="marker" value={location} onChange={(e: any) => setLocation(e.target.value)} required />
            <Field className="mb-6" label={t("Bio")} placeholder={t("Short bio")} icon="user-check" value={bio} onChange={(e: any) => setBio(e.target.value)} textarea required />
            <button className="btn-blue w-full">{t("Save changes")}</button>
        </form>;
};
export default EditProfile;