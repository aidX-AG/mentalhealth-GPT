import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import { useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n/I18nContext";

type UserItem = {
  id: string;
  name: string;
  avatar: string;
  status?: string;
};

type UserProps = {
  item: UserItem;
};

const User = ({ item }: UserProps) => {
  const t = useTranslation();

  const typesAccess = useMemo(
    () => [
      { id: "0", title: t("Full access") },
      { id: "1", title: t("Can view") },
      { id: "2", title: t("Can start chat") },
    ],
    [t]
  );

  const [typeAccess, setTypeAccess] = useState(typesAccess[1]);
  return (
    <div className="flex items-center mb-5 last:mb-0">
      <div className="relative w-8 h-8 mr-3">
        <Image
          className="object-cover rounded-full"
          src={item.avatar}
          fill
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="mr-auto base2 font-semibold text-n-5 dark:text-n-3">
        {item.name}
      </div>
      {item.status ? (
        <div className="flex items-center caption1 font-semibold text-n-4">
          {item.status}{" "}
          <Icon
            className="w-5 h-5 ml-1.5 fill-n-4"
            name="check-thin"
            aria-hidden="true"
          />
        </div>
      ) : (
        <Select
          className="shrink-0"
          classButton="h-auto px-0 !shadow-none caption1 font-semibold"
          classOptions="left-auto -right-1 w-[10.125rem]"
          classOption="items-end caption1 font-semibold"
          items={typesAccess}
          value={typeAccess}
          onChange={(value) => value && setTypeAccess(value)}
        />
      )}
    </div>
  );
};
export default User;