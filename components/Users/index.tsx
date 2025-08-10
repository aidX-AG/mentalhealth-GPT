import Image from "@/components/Image";
import i18next from "i18next";

type UsersProps = {
    items: Array<string>;
    borderColor?: string;
};

const Users = ({ items, borderColor }: UsersProps) => (
    <div className="flex -mt-0.5 -ml-0.5">
        {items.map((image, index) => (
            <div
                className={`relative w-7 h-7 -ml-2.5 border-2 rounded-full first:ml-0 ${
                    borderColor || "border-n-1 dark:border-n-6"
                }`}
                key={index}
            >
                <Image
                    className="rounded-full object-cover"
                    src={image}
                    fill
                    alt={i18next.t("common.alt.avatar", { defaultValue: "Avatar" })}
                />
            </div>
        ))}
    </div>
);

export default Users;
