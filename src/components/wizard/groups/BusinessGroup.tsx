import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { EnhanceableTextarea } from "@/components/forms/EnhanceableTextarea";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { OptionCard } from "@/components/ui/OptionCard";
import { INDUSTRIES } from "@/data/industries";
import { BUSINESS_STAGES } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";

export function BusinessGroup({ errors }: GroupProps) {
  const business = useProjectStore((state) => state.project.business);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof business>) => patch("business", value);

  return (
    <div className="space-y-8">
      <Field label="Business name" htmlFor="business-name" error={errors.name}>
        <Input
          id="business-name"
          value={business.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder="Miami Pro Locksmith"
          autoComplete="organization"
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <Field
        label="Business category"
        htmlFor="business-industry"
        help="Pick the closest match, or type your own."
        error={errors.industry}
      >
        <SearchSelect
          id="business-industry"
          options={INDUSTRIES}
          value={business.industry}
          onChange={(industry) => update({ industry })}
          placeholder="Search categories"
          allowCustom
          invalid={Boolean(errors.industry)}
        />
      </Field>

      <Field
        label="Describe your business in a few sentences"
        htmlFor="business-description"
        help="What do you do, who do you help, and what makes your business different? This becomes the backbone of every page of copy."
        error={errors.description}
      >
        <EnhanceableTextarea
          field="business-description"
          id="business-description"
          rows={5}
          value={business.description}
          onChange={(description) => update({ description })}
          placeholder="We're a family-owned locksmith serving Miami-Dade since 2009. We handle emergency lockouts, rekeys and commercial access control, with technicians on the road 24 hours a day."
          aria-invalid={Boolean(errors.description)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Year established" htmlFor="business-year" optional>
          <Input
            id="business-year"
            inputMode="numeric"
            value={business.yearEstablished ?? ""}
            onChange={(event) => update({ yearEstablished: event.target.value })}
            placeholder="2009"
          />
        </Field>
        <Field label="Number of locations" htmlFor="business-locations" optional>
          <Input
            id="business-locations"
            inputMode="numeric"
            value={business.locationCount ?? ""}
            onChange={(event) => update({ locationCount: event.target.value })}
            placeholder="1"
          />
        </Field>
      </div>

      <QuestionBlock id="q-stage" question="Where is your business right now?">
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="q-stage">
          {BUSINESS_STAGES.map((stage) => (
            <OptionCard
              key={stage.value}
              title={stage.label}
              description={stage.description}
              selected={business.businessStage === stage.value}
              onSelect={() =>
                update({
                  businessStage: business.businessStage === stage.value ? undefined : stage.value,
                })
              }
              className="p-4"
            />
          ))}
        </div>
      </QuestionBlock>
    </div>
  );
}
