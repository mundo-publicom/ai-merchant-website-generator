import { Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WEEK_DAYS } from "@/data/options";
import type { WeekDay } from "@/types/project";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/utils/cn";

export function BusinessHoursEditor() {
  const hours = useProjectStore((state) => state.project.businessHours);
  const setHours = useProjectStore((state) => state.setHours);
  const setOpen24 = useProjectStore((state) => state.setOpen24);
  const copyWeekdayHours = useProjectStore((state) => state.copyWeekdayHours);
  const patch = useProjectStore((state) => state.patch);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={hours.open24 ? "subtle" : "secondary"}
          size="sm"
          aria-pressed={hours.open24}
          onClick={() => setOpen24(!hours.open24)}
        >
          Open 24 hours
        </Button>
        {!hours.open24 ? (
          <Button variant="secondary" size="sm" onClick={copyWeekdayHours}>
            <Copy className="size-4" />
            Same Monday to Friday
          </Button>
        ) : null}
      </div>

      {!hours.open24 ? (
        <ul className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200 bg-white">
          {WEEK_DAYS.map(({ value, label }) => {
            const day = hours.days[value as WeekDay];
            return (
              <li
                key={value}
                className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap"
              >
                <span className="w-24 shrink-0 text-[14px] font-medium text-ink-800">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!day.closed}
                  aria-label={`${label} open`}
                  onClick={() => setHours(value as WeekDay, { closed: !day.closed })}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    day.closed ? "bg-ink-200" : "bg-cobalt-600",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                      day.closed ? "translate-x-0.5" : "translate-x-[1.375rem]",
                    )}
                  />
                </button>
                {day.closed ? (
                  <span className="text-[14px] text-ink-400">Closed</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={day.open}
                      aria-label={`${label} opening time`}
                      onChange={(event) => setHours(value as WeekDay, { open: event.target.value })}
                      className="h-10 rounded-lg border border-ink-200 px-2.5 text-[14px] focus:border-cobalt-500 focus:outline-none focus:ring-4 focus:ring-cobalt-100"
                    />
                    <span className="text-ink-400">–</span>
                    <input
                      type="time"
                      value={day.close}
                      aria-label={`${label} closing time`}
                      onChange={(event) => setHours(value as WeekDay, { close: event.target.value })}
                      className="h-10 rounded-lg border border-ink-200 px-2.5 text-[14px] focus:border-cobalt-500 focus:outline-none focus:ring-4 focus:ring-cobalt-100"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-[14px] text-ink-600">
          Your website will show “Open 24 hours, 7 days a week”.
        </p>
      )}

      <input
        value={hours.note ?? ""}
        onChange={(event) => patch("businessHours", { note: event.target.value })}
        placeholder="Anything else about your hours? (optional)"
        aria-label="Note about business hours"
        className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-[14px] placeholder:text-ink-400 focus:border-cobalt-500 focus:outline-none focus:ring-4 focus:ring-cobalt-100"
      />
    </div>
  );
}
