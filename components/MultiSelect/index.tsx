import { useCallback, useId, useMemo } from "react";
import Select, {
  components,
  OptionProps,
  MultiValueRemoveProps,
  Props as ReactSelectProps,
} from "react-select";
import { twMerge } from "tailwind-merge";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useTranslation } from "@/lib/i18n/I18nContext";

const { Option, MultiValueRemove } = components;

type SelectOption = {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
};

const DetailsOption = (props: OptionProps<SelectOption>) => {
  // Important: keep react-select event/aria wiring intact via {...props.innerProps}
  return (
    <Option {...props}>
      <div className="relative w-10 h-10 mr-3">
        <Image
          className="rounded-full object-cover"
          src={props.data.avatar}
          fill
          alt={props.data.name || "Avatar"}
        />
      </div>
      <div className="grow min-w-0">
        <div className="base2 font-semibold text-n-5 dark:text-n-1 truncate">
          {props.data.name}
        </div>
        <div className="caption1 text-n-4/50 dark:text-n-3/50 truncate">
          {props.data.email}
        </div>
      </div>
    </Option>
  );
};

const CustomMultiValueRemove = (props: MultiValueRemoveProps<SelectOption>) => (
  <MultiValueRemove {...props}>
    <Icon className="w-4 h-4 fill-inherit transition-transform" name="close" />
  </MultiValueRemove>
);

type MultiSelectProps = {
  className?: string;
  classMultiSelectGlobal?: string;

  /** Options */
  items: SelectOption[];

  /** Controlled value */
  selectedOptions: SelectOption[];
  setSelectedOptions: (options: SelectOption[]) => void;

  /** Optional a11y + form integration */
  ariaLabel?: string;
  inputId?: string;
  name?: string;

  /** Optional customization */
  isDisabled?: boolean;
};

const MultiSelect = ({
  className,
  classMultiSelectGlobal,
  items,
  selectedOptions,
  setSelectedOptions,
  ariaLabel,
  inputId,
  name,
  isDisabled,
}: MultiSelectProps) => {
  const t = useTranslation();

  // SSR-stable IDs (prevents hydration mismatch in react-select)
  const reactId = useId();
  const resolvedInputId = inputId ?? `multiselect-${reactId}`;

  const handleMultiSelectChange = useCallback(
    (selected: readonly SelectOption[] | null) => {
      setSelectedOptions(selected ? [...selected] : []);
    },
    [setSelectedOptions]
  );

  const getOptionLabel = useCallback((option: SelectOption) => option.name, []);
  const getOptionValue = useCallback((option: SelectOption) => String(option.id), []);

  const formatOptionLabel = useCallback((option: SelectOption) => {
    return (
      <div className="flex items-center base2 font-semibold min-w-0">
        <div className="relative w-6 h-6 mr-2">
          <Image
            className="rounded-full object-cover"
            src={option.avatar}
            fill
            alt={option.name || "Avatar"}
          />
        </div>
        <span className="mr-3 truncate">{option.name}</span>
      </div>
    );
  }, []);

  const noOptionsMessage = useCallback(() => t("No people found"), [t]);

  const selectComponents = useMemo<ReactSelectProps<SelectOption, true>["components"]>(
    () => ({
      Option: DetailsOption,
      MultiValueRemove: CustomMultiValueRemove,
    }),
    []
  );

  return (
    <div className={twMerge("relative", className)}>
      <Select<SelectOption, true>
        instanceId={`multiselect-${reactId}`}
        inputId={resolvedInputId}
        name={name}
        aria-label={ariaLabel ?? t("Name member")}
        className={twMerge("multiselect", classMultiSelectGlobal)}
        classNamePrefix="multiselect"
        value={selectedOptions}
        onChange={handleMultiSelectChange}
        options={items}
        isMulti
        isDisabled={isDisabled}
        isClearable={false}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        formatOptionLabel={formatOptionLabel}
        placeholder={t("Name member")}
        noOptionsMessage={noOptionsMessage}
        components={selectComponents}
      />

      <Icon
        className={twMerge(
          "absolute top-4 left-5 w-5 h-5 pointer-events-none fill-n-4/50 dark:fill-n-4/75",
          selectedOptions.length !== 0 && "hidden"
        )}
        name="email"
        aria-hidden="true"
      />
    </div>
  );
};

export default MultiSelect;
