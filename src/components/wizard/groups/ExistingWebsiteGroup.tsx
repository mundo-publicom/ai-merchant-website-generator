import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { Input } from "@/components/ui/Input";
import { EnhanceableTextarea } from "@/components/forms/EnhanceableTextarea";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { EXISTING_SITE_PROBLEMS } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";

export function ExistingWebsiteGroup({ errors }: GroupProps) {
  const existing = useProjectStore((state) => state.project.existingWebsite);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof existing>) => patch("existingWebsite", value);

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-existing-url"
        question="What is your current website address?"
        error={errors.url}
      >
        <Input
          id="existing-url"
          type="url"
          inputMode="url"
          value={existing.url ?? ""}
          onChange={(event) => update({ url: event.target.value })}
          placeholder="https://example.com"
          aria-invalid={Boolean(errors.url)}
          aria-labelledby="q-existing-url"
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-existing-likes"
        question="What do you like about it?"
        help="Anything worth keeping - a section, the tone, the photos, the logo."
      >
        <EnhanceableTextarea
          field="existing-likes"
          value={existing.likes ?? ""}
          onChange={(likes) => update({ likes })}
          placeholder="The photos of our team and the reviews section."
          aria-labelledby="q-existing-likes"
        />
      </QuestionBlock>

      <QuestionBlock id="q-existing-dislikes" question="What do you dislike about it?">
        <EnhanceableTextarea
          field="existing-dislikes"
          value={existing.dislikes ?? ""}
          onChange={(dislikes) => update({ dislikes })}
          placeholder="It looks dated and nobody can find our phone number."
          aria-labelledby="q-existing-dislikes"
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-existing-problems"
        question="What is currently not working well?"
        help="Select everything that applies."
      >
        <ChoiceChips
          options={EXISTING_SITE_PROBLEMS}
          value={existing.problems}
          onChange={(problems) => update({ problems })}
          allowOther
          otherPlaceholder="Something else that's not working"
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-existing-preserve"
        question="What should we preserve from the current site?"
        help="Logo, existing content, photos, brand colours, blog posts, testimonials, SEO pages."
      >
        <EnhanceableTextarea
          field="existing-preserve"
          value={existing.preserve ?? ""}
          onChange={(preserve) => update({ preserve })}
          placeholder="Our logo, the service descriptions, and the blog posts."
          aria-labelledby="q-existing-preserve"
        />
      </QuestionBlock>
    </div>
  );
}
