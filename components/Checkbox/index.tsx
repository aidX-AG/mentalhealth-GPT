import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";

type CheckboxProps = {
  className?: string;
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  reverse?: boolean;
  disabled?: boolean;
  ariaLabel?: string; // needed when label is omitted
};

const Checkbox = ({
  className,
  label,
  checked,
  onCheckedChange,
  reverse,
  disabled,
  ariaLabel,
}: CheckboxProps) => {
  const accessibleLabel = label ?? ariaLabel;

  return (
    <label
      className={twMerge(
        "group relative flex items-start select-none tap-highlight-color",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        reverse && "flex-row-reverse",
        className
      )}
    >
      <input
        className="absolute top-0 left-0 opacity-0"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange(e.target.checked)}
        aria-label={accessibleLabel}
      />

      <span
        className={twMerge(
          "relative flex justify-center items-center shrink-0 w-6 h-6 rounded border-2 transition-colors",
          "border-n-3 dark:border-n-5 group-hover:border-primary-1",
          "focus-within:ring-2 focus-within:ring-primary-1 focus-within:ring-offset-2 focus-within:ring-offset-transparent",
          checked ? "bg-primary-1 border-primary-1" : "bg-transparent"
        )}
      >
        <Icon
          className={twMerge(
            "w-4.5 h-4.5 fill-n-1 transition-opacity",
            checked ? "opacity-100" : "opacity-0"
          )}
          name="check"
        />
      </span>

      {label && (
        <span
          className={twMerge(
            "base2 text-n-6 dark:text-n-3",
            reverse ? "mr-auto pr-3" : "pl-3"
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
