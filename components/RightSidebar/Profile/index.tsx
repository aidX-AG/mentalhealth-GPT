import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { _ } from "@/lib/i18n/_";
const t = _;

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const menu = [
    {
      title: t("Log in"),           // ✅ Text geändert
      icon: "log-in", 
      onClick: () => window.location.href = "/sign-in"
    },
    {
      title: t("Create account"),   // ✅ Text geändert  
      icon: "arrow-down-circle", 
      onClick: () => window.location.href = "/sign-in?tab=create-account"
    }
  ];

  return (
    <div className="relative z-10 mr-8 lg:mr-6 md:static">
      <Menu>
        <Menu.Button className="group relative w-10 h-10 rounded-full transition-shadow ui-open:shadow-[0_0_0_0.25rem_#0084FF]">
          <Image 
            className="rounded-full object-cover dark:hidden" 
            src="/images/power-button.webp" 
            fill 
            alt={t("Log in")} 
          />
          <Image 
            className="rounded-full object-cover hidden dark:block" 
            src="/images/power-button-dark.webp" 
            fill 
            alt={t("Log in")} 
          />
        </Menu.Button>
        
        <Transition 
          enter="transition duration-100 ease-out" 
          enterFrom="transform scale-95 opacity-0" 
          enterTo="transform scale-100 opacity-100" 
          leave="transition duration-75 ease-out" 
          leaveFrom="transform scale-100 opacity-100" 
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute top-full -right-5 w-[19.88rem] mt-[0.9375rem] p-4 bg-n-1 border border-n-2 rounded-2xl shadow-[0px_48px_64px_-16px_rgba(0,0,0,0.25)] md:-right-38 md:w-[calc(100vw-4rem)] dark:bg-n-7 dark:border-n-5">
            
            <div className="flex items-center mb-3">
              <div className="relative w-15 h-15">
                <Image 
                  className="rounded-full object-cover dark:hidden" 
                  src="/images/power-button.webp" 
                  fill 
                  alt={t("Log in")} 
                />
                <Image 
                  className="rounded-full object-cover hidden dark:block" 
                  src="/images/power-button-dark.webp" 
                  fill 
                  alt={t("Log in")} 
                />
              </div>
              <div className="pl-4">
                <div className="h6">{t("Welcome")}</div>
                <div className="caption1 text-n-4">
                  {t("Already have an account?")} {/* ✅ Angepasste Welcome Nachricht */}
                </div>
              </div>
            </div>
            
            <div className="px-4 bg-n-2 rounded-xl dark:bg-n-6">
              {menu.map((item, index) => (
                <Menu.Item key={index}>
                  <button 
                    className="group flex items-center w-full h-12 base2 font-semibold transition-colors hover:text-primary-1" 
                    onClick={item.onClick}
                  >
                    <Icon className="mr-4 fill-n-4 transition-colors group-hover:fill-primary-1" name={item.icon} />
                    {item.title}
                  </button>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Profile;
