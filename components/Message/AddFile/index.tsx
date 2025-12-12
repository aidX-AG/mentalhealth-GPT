import { ChangeEvent, useRef } from "react";
import Icon from "@/components/Icon";
import { _ } from "@/lib/i18n/_";
const t = _;

type AddFileProps = {
  disabled?: boolean;
  onFileSelected?: (file: File) => void;
};

const AddFile = ({ disabled = false, onFileSelected }: AddFileProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onFileSelected) {
      onFileSelected(file);
    }

    // Reset, damit dieselbe Datei später nochmals gewählt werden kann
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`mr-4 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-n-4 transition-colors hover:border-primary-1 hover:text-primary-1 dark:border-n-5 ${
          disabled
            ? "cursor-not-allowed opacity-40 hover:border-n-4 hover:text-inherit"
            : ""
        }`}
        aria-disabled={disabled}
        title={t("Upload file")}
      >
        <Icon className="w-5 h-5 fill-current" name="plus" />
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </>
  );
};

export default AddFile;
