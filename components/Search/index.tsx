import { useState, useMemo, useCallback, useId } from "react";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import Item from "./Item";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Search Component
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Icon names NOT translated (identifiers: "search-1", "user-check", "clock")
 * - Stable IDs for Select options (prevent re-init on locale change)
 * - Uses searchTitle in submit (fix "dead state")
 * - Select values `?? null` (not undefined)
 * - Toggle-off: re-clicking same filter clears it
 * - A11y: type="search", inputMode="search", enterKeyHint="search"
 * - No console.log (ISO 27001)
 * - Optional onSearch handler with capability check
 * ============================================================================
 */

type SelectOption = {
  id: string | number;
  title: string;
};

type SearchResultItem = {
  id: string;
  author: string;
  title: string;
  content: string;
  time: string;
  avatar: string;
  online: boolean;
  url: string;
};

type SearchGroup = {
  id: string;
  title: string;
  date?: string;
  list: SearchResultItem[];
};

type SearchFilters = {
  createdBy?: string | number;
  date?: string | number;
};

type SearchProps = {
  items: SearchGroup[];
  onSearch?: (query: string, filters: SearchFilters) => void;
};

const Search = ({ items, onSearch }: SearchProps) => {
  const t = useTranslation();

  // Stable IDs prevent Select re-init on locale change
  const createdOptions = useMemo<SelectOption[]>(
    () => [
      { id: "created-video", title: t("Video") },
      { id: "created-audio", title: t("Audio") },
      { id: "created-code", title: t("Code") },
    ],
    [t]
  );

  const dateOptions = useMemo<SelectOption[]>(
    () => [
      { id: "date-today", title: t("Today") },
      { id: "date-week", title: t("Last week") },
      { id: "date-30days", title: t("Last 30 days") },
    ],
    [t]
  );

  // Search state
  const [search, setSearch] = useState<string>("");
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [createdById, setCreatedById] = useState<string | number | undefined>(undefined);
  const [dateId, setDateId] = useState<string | number | undefined>(undefined);

  // Unique IDs for inputs
  const searchMainId = useId();
  const searchTitleId = useId();

  const canSearch = typeof onSearch === "function";

  // Select values (null instead of undefined for controlled components)
  const createdByValue = useMemo(
    () => createdOptions.find((x) => x.id === createdById) ?? null,
    [createdOptions, createdById]
  );

  const dateValue = useMemo(
    () => dateOptions.find((x) => x.id === dateId) ?? null,
    [dateOptions, dateId]
  );

  // Toggle-off: re-clicking same filter clears it
  const handleCreatedByChange = useCallback((item: SelectOption | null) => {
    if (!item) return;
    setCreatedById((prev) => (prev === item.id ? undefined : item.id));
  }, []);

  const handleDateChange = useCallback((item: SelectOption | null) => {
    if (!item) return;
    setDateId((prev) => (prev === item.id ? undefined : item.id));
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleSearchTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTitle(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSearch) return;

      // Use searchTitle if present, fallback to main search
      const query = searchTitle.trim() || search.trim();
      if (!query && !createdById && !dateId) return;

      onSearch(query, {
        createdBy: createdById,
        date: dateId,
      });
    },
    [canSearch, onSearch, search, searchTitle, createdById, dateId]
  );

  return (
    <form onSubmit={handleSubmit} role="search">
      <div className="relative border-b border-n-3 dark:border-n-6">
        <button
          className="group absolute top-7 left-10 outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 md:hidden"
          type="submit"
          disabled={!canSearch}
          aria-disabled={!canSearch}
          aria-label={t("Search")}
        >
          <Icon
            className="w-8 h-8 fill-n-4/50 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-3"
            name="search-1"
            aria-hidden="true"
          />
        </button>

        <input
          id={searchMainId}
          className="w-full h-22 pl-24 pr-5 bg-transparent border-none outline-none h5 text-n-7 placeholder:text-n-4/50 md:h-18 md:pl-18 dark:text-n-1"
          type="search"
          inputMode="search"
          enterKeyHint="search"
          name="search"
          placeholder={t("Search")}
          value={search}
          onChange={handleSearchChange}
          aria-label={t("Search")}
        />
      </div>

      <div className="pt-5 px-10 pb-6 md:px-6">
        <div className="flex mb-5 md:block md:space-y-4 md:mb-0">
          <div className="relative w-[10.31rem] mr-3 md:w-full md:mr-0">
            <button
              className="group absolute top-3 left-4 text-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 rounded-full"
              type="submit"
              disabled={!canSearch}
              aria-disabled={!canSearch}
              aria-label={t("Search")}
            >
              <Icon
                className="w-5 h-5 fill-n-7 transition-colors group-hover:fill-primary-1 dark:fill-n-1"
                name="search-1"
                aria-hidden="true"
              />
            </button>

            <input
              id={searchTitleId}
              className="w-full h-11 pl-11 pr-4 bg-transparent shadow-[inset_0_0_0_0.0625rem_#DADBDC] rounded-full outline-none caption1 text-n-7 transition-shadow focus:shadow-[inset_0_0_0_0.125rem_#0084FF] placeholder:text-n-4 dark:shadow-[inset_0_0_0_0.0625rem_#2A2E2F] dark:text-n-1 dark:focus:shadow-[inset_0_0_0_0.125rem_#0084FF]"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              name="searchTitle"
              placeholder={t("Search ...")}
              value={searchTitle}
              onChange={handleSearchTitleChange}
              aria-label={t("Search by title")}
            />
          </div>

          <Select
            className="w-[10.31rem] mr-3 md:w-full md:mr-0"
            classButton="h-11 rounded-full shadow-[inset_0_0_0_0.0625rem_#DADBDC] caption1 dark:shadow-[inset_0_0_0_0.0625rem_#2A2E2F] dark:bg-transparent"
            classOptions="min-w-full"
            classIcon="w-5 h-5 fill-n-4/50"
            classArrow="dark:fill-n-4"
            icon="user-check"
            placeholder={t("Created by")}
            items={createdOptions}
            value={createdByValue}
            onChange={handleCreatedByChange}
          />

          <Select
            className="w-[10.31rem] md:w-full md:mr-0"
            classButton="h-11 rounded-full shadow-[inset_0_0_0_0.0625rem_#DADBDC] caption1 dark:shadow-[inset_0_0_0_0.0625rem_#2A2E2F] dark:bg-transparent"
            classOptions="min-w-full"
            classIcon="w-5 h-5 fill-n-4/50"
            classArrow="dark:fill-n-4"
            icon="clock"
            placeholder={t("Date")}
            items={dateOptions}
            value={dateValue}
            onChange={handleDateChange}
          />
        </div>

        <div>
          {items.map((x) => (
            <Item item={x} key={x.id} />
          ))}
        </div>
      </div>
    </form>
  );
};

export default Search;
