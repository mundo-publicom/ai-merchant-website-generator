import type { HomepageSectionPlan } from "@/types/project";

export function HomepagePlanViewer({ plan }: { plan: HomepageSectionPlan[] }) {
  return (
    <ol className="space-y-3">
      {plan.map((section, index) => (
        <li key={`${section.title}-${index}`}>
          <div className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-6">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[13px] font-medium text-cobalt-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[17px] font-semibold text-ink-950">{section.title}</h3>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{section.purpose}</p>
            <ul className="mt-4 space-y-2 border-l-2 border-ink-100 pl-4">
              {section.includes.map((item, itemIndex) => (
                <li key={itemIndex} className="text-[14px] leading-relaxed text-ink-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
