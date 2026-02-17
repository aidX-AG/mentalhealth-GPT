import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";

type NotifyProps = {
  className?: string;
  iconCheck?: boolean;
  iconDelete?: boolean;
  children: React.ReactNode;
  variant?: "status" | "alert"; // optional, defaults to status
};

const Notify = ({
  className,
  iconCheck,
  iconDelete,
  children,
  variant = "status",
}: NotifyProps) => {
  // If both are set, prefer delete (or change to prefer check)
  const showDelete = Boolean(iconDelete);
  const showCheck = Boolean(iconCheck) && !showDelete;

  return (
    <div
      className={twMerge(
        "flex items-center gap-3 p-4 rounded-2xl bg-n-7 text-n-1 md:-mb-5",
        className
      )}
      role={variant === "alert" ? "alert" : "status"}
      aria-live="polite"
    >
      {showCheck && (
        <div
          className="flex justify-center items-center shrink-0 w-10 h-10 rounded-full bg-primary-2"
          aria-hidden="true"
        >
          <Icon className="fill-n-7" name="check-thin" />
        </div>
      )}

      {showDelete && (
        <div
          className="flex justify-center items-center shrink-0 w-10 h-10 rounded-full bg-accent-1"
          aria-hidden="true"
        >
          <Icon className="fill-n-1" name="trash" />
        </div>
      )}

      <div className="min-w-0">{children}</div>
    </div>
  );
};

export default Notify;
