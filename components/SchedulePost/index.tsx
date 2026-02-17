"use client";

import { useMemo, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import Icon from "@/components/Icon";
import "react-datepicker/dist/react-datepicker.css";
import { useI18n } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Schedule Post (Buffer Integration)
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Client component (react-datepicker is browser-first)
 * - Icon names NOT translated ("calendar", "time", "info-circle")
 * - Typed date states (Date | null)
 * - Prevent scheduling in the past (minDate + filterDate)
 * - Accessible inputs (id + label + aria-label)
 * - Merges date + time into a single scheduledAt Date (timezone-safe)
 * ============================================================================
 */

type SchedulePostProps = {
  onSchedule?: (date: Date, time: Date) => void; // keep your current API
  // (optional future): onSchedule?: (scheduledAt: Date) => void;
};

const SchedulePost = ({ onSchedule }: SchedulePostProps) => {
  const { locale, t } = useI18n();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());

  const canSchedule = typeof onSchedule === "function";

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isPastDate = useCallback(
    (date: Date) => date < todayStart,
    [todayStart]
  );

  const handleSchedule = useCallback(() => {
    if (!canSchedule || !startDate || !selectedTime) return;

    // Merge date + time into one scheduled datetime (local timezone)
    const scheduledAt = new Date(startDate);
    scheduledAt.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0
    );

    // Keep existing API contract:
    onSchedule(startDate, selectedTime);

    // (optional future): onSchedule?.(scheduledAt);
    void scheduledAt; // keeps lint happy if you don't use it yet
  }, [canSchedule, onSchedule, startDate, selectedTime]);

  return (
    <div>
      <div className="mb-5 font-bold">{t("Schedule your post with Buffer")}</div>

      <div className="p-5 bg-n-1 rounded-xl dark:bg-n-6">
        <div className="flex mb-4 space-x-4 md:block md:space-x-0">
          <div className="basis-1/2 md:mb-4">
            <label htmlFor="schedule-date" className="mb-2 base2 font-semibold block">
              {t("Choose date")}
            </label>

            <div className="relative">
              <DatePicker
                id="schedule-date"
                aria-label={t("Choose date")}
                className="w-full h-12 pl-[2.625rem] border-2 border-n-4/25 bg-transparent rounded-xl font-inter base2 text-n-6 outline-none transition-colors focus:border-primary-1 dark:text-n-3"
                dateFormat="dd MMMM yyyy"
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                formatWeekDay={(nameOfDay) => nameOfDay.toString().slice(0, 1)}
                minDate={todayStart}
                filterDate={(d) => !isPastDate(d)}
              />

              <Icon
                className="absolute top-3 left-3 fill-n-6 pointer-events-none dark:fill-n-3"
                name="calendar"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="basis-1/2">
            <label htmlFor="schedule-time" className="mb-2 base2 font-semibold block">
              {t("Time")}
            </label>

            <div className="relative">
              <DatePicker
                id="schedule-time"
                aria-label={t("Choose time")}
                className="w-full h-12 pl-[2.625rem] border-2 border-n-4/25 bg-transparent rounded-xl font-inter base2 text-n-6 outline-none transition-colors focus:border-primary-1 dark:text-n-3"
                selected={selectedTime}
                onChange={(time: Date | null) => setSelectedTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
              />

              <Icon
                className="absolute top-3 left-3 fill-n-6 pointer-events-none dark:fill-n-3"
                name="time"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4 text-n-4/50 caption1 font-semibold dark:text-n-4">
          <Icon
            className="w-4 h-4 mr-3 fill-n-4/50 dark:fill-n-4"
            name="info-circle"
            aria-hidden="true"
          />
          {t("Scheduled in your current timezone")}
        </div>

        <div className="text-right">
          <button
            type="button"
            className="btn-dark md:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSchedule}
            disabled={!canSchedule || !startDate || !selectedTime}
            aria-disabled={!canSchedule || !startDate || !selectedTime}
          >
            {t("Schedule")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePost;
