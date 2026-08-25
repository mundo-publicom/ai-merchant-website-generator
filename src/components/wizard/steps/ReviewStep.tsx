import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildReviewSections } from "@/services/reviewSummary";
import { useProjectStore } from "@/store/useProjectStore";

export function ReviewStep() {
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.project);

  const sections = useMemo(() => buildReviewSections(project), [project]);

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.title} className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/60 px-5 py-3">
            <h2 className="text-[15px] font-semibold text-ink-900">{section.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/plan/${section.step}`)}
              aria-label={`Edit ${section.title}`}
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </div>
          <dl className="divide-y divide-ink-100">
            {section.rows.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4"
              >
                <dt className="text-[13px] font-medium text-ink-500">{item.label}</dt>
                <dd className="text-[14px] leading-relaxed text-ink-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}
