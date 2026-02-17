import { twMerge } from "tailwind-merge";
import Image from "@/components/Image";
import { useTranslation } from "@/lib/i18n/I18nContext";

type UsersProps = {
  items: string[];
  borderColor?: string;
  ariaLabel?: string; // optional: describe the group
};

const Users = ({ items, borderColor, ariaLabel }: UsersProps) => {
  const t = useTranslation();

  if (!items || items.length === 0) return null;

  const borderClass = borderColor ?? "border-n-1 dark:border-n-6";

  return (
    <div
      className="flex -mt-0.5 -ml-0.5"
      aria-label={ariaLabel ?? t("Avatars")}
      role="group"
    >
      {items.map((src, index) => (
        <div
          // stable even if src duplicates
          key={`${src}::${index}`}
          className={twMerge(
            "relative w-7 h-7 -ml-2.5 border-2 rounded-full first:ml-0",
            borderClass
          )}
        >
          <Image
            className="rounded-full object-cover"
            src={src}
            fill
            // decorative avatars in a group → avoid repeating "Avatar"
            alt=""
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
};

export default Users;
