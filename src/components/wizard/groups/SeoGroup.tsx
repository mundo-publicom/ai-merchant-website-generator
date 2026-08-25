import { useMemo } from "react";
import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { TagInput } from "@/components/ui/TagInput";
import { DISCOVERY_CHANNELS } from "@/data/options";
import { industryLabel } from "@/data/industries";
import { useProjectStore } from "@/store/useProjectStore";

export function SeoGroup() {
  const project = useProjectStore((state) => state.project);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof project.seo>) => patch("seo", value);

  const suggestions = useMemo(() => {
    const location =
      project.location.serviceAreas[0] ?? project.location.city ?? "";
    const industry = industryLabel(project.business.industry).toLowerCase();
    const services = project.services.map((s) => s.name.toLowerCase()).filter(Boolean);
    const base = [
      ...services.slice(0, 3).map((service) => (location ? `${service} ${location}` : service)),
      location ? `${industry} near me` : "",
      location ? `${industry} ${location}` : "",
    ];
    return base.filter(Boolean);
  }, [project.business.industry, project.location.city, project.location.serviceAreas, project.services]);

  const locationSuggestions = project.location.serviceAreas.filter(
    (area) => !project.seo.importantLocations.includes(area),
  );

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-channels"
        question="Where do you want customers to find you?"
        help="This tells us what to prioritise - a business that lives on Google Maps needs different things from one that lives on Instagram."
      >
        <ChoiceChips
          options={DISCOVERY_CHANNELS}
          value={project.seo.discoveryChannels}
          onChange={(discoveryChannels) => update({ discoveryChannels })}
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-search-terms"
        question="What would a customer type into Google to find a business like yours?"
        help="Write them the way a real customer would - “locked out of my car”, not “automotive lock solutions”."
      >
        <TagInput
          id="search-terms"
          value={project.seo.searchTerms}
          onChange={(searchTerms) => update({ searchTerms })}
          placeholder="emergency locksmith Miami"
          suggestions={suggestions}
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-locations"
        question="Which locations matter most?"
        help="We'll recommend a dedicated page for each one."
      >
        <TagInput
          id="important-locations"
          value={project.seo.importantLocations}
          onChange={(importantLocations) => update({ importantLocations })}
          placeholder="Miami, Coral Gables"
          suggestions={locationSuggestions}
        />
      </QuestionBlock>
    </div>
  );
}
