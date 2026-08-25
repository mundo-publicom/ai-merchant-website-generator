import { Sparkles, Wrench } from "lucide-react";
import { OptionCard } from "@/components/ui/OptionCard";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";

export function WebsiteTypeGroup({ errors }: GroupProps) {
  const type = useProjectStore((state) => state.project.websiteProjectType);
  const setProjectType = useProjectStore((state) => state.setProjectType);

  return (
    <div className="space-y-4" role="radiogroup" aria-label="Website project type">
      <div className="grid gap-4 sm:grid-cols-2">
        <OptionCard
          title="Build a new website"
          description="I don't have a website yet, or I want to start from scratch."
          icon={<Sparkles className="size-5" />}
          selected={type === "new"}
          onSelect={() => setProjectType("new")}
        />
        <OptionCard
          title="Redesign an existing website"
          description="I already have a website and want to improve or replace it."
          icon={<Wrench className="size-5" />}
          selected={type === "redesign"}
          onSelect={() => setProjectType("redesign")}
        />
      </div>
      {errors.websiteProjectType ? (
        <p role="alert" data-field-error className="text-[13px] font-medium text-red-600">
          {errors.websiteProjectType}
        </p>
      ) : null}
    </div>
  );
}
