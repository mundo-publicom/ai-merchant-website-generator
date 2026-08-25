import { Plus, Trash2 } from "lucide-react";
import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { EnhanceableTextarea } from "@/components/forms/EnhanceableTextarea";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";
import type { GroupProps } from "@/components/wizard/groups/types";

const MAX_INSPIRATION = 5;

export function InspirationGroup({ errors }: GroupProps) {
  const inspirationSites = useProjectStore((state) => state.project.inspirationSites);
  const competitors = useProjectStore((state) => state.project.competitors);
  const addInspiration = useProjectStore((state) => state.addInspiration);
  const updateInspiration = useProjectStore((state) => state.updateInspiration);
  const removeInspiration = useProjectStore((state) => state.removeInspiration);
  const addCompetitor = useProjectStore((state) => state.addCompetitor);
  const updateCompetitor = useProjectStore((state) => state.updateCompetitor);
  const removeCompetitor = useProjectStore((state) => state.removeCompetitor);

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-inspiration"
        question="Are there websites you like?"
        help="They don't need to be in your industry. Tell us what you like about each one - that's the useful part."
        error={errors.inspirationSites}
      >
        <div className="space-y-4">
          {inspirationSites.map((site, index) => (
            <Card key={site.id} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-ink-500">Reference {index + 1}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeInspiration(site.id)}
                  aria-label={`Remove reference ${index + 1}`}
                  className="px-2"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <Field label="Website" htmlFor={`insp-url-${site.id}`}>
                  <Input
                    id={`insp-url-${site.id}`}
                    type="url"
                    inputMode="url"
                    value={site.url}
                    onChange={(event) => updateInspiration(site.id, { url: event.target.value })}
                    placeholder="https://example.com"
                  />
                </Field>
                <Field label="What do you like about it?" htmlFor={`insp-notes-${site.id}`} optional>
                  <EnhanceableTextarea
                    field="inspiration-notes"
                    id={`insp-notes-${site.id}`}
                    rows={2}
                    value={site.notes ?? ""}
                    onChange={(notes) => updateInspiration(site.id, { notes })}
                    placeholder="The large photography and how simple the homepage is."
                  />
                </Field>
              </div>
            </Card>
          ))}

          <Button
            variant="secondary"
            onClick={() => {
              if (inspirationSites.length >= MAX_INSPIRATION) {
                toast.warning(`${MAX_INSPIRATION} references is the maximum`, {
                  description: "That is already plenty for us to work from.",
                });
                return;
              }
              addInspiration();
            }}
            aria-disabled={inspirationSites.length >= MAX_INSPIRATION}
          >
            <Plus className="size-4" />
            {inspirationSites.length ? "Add another website" : "Add a website"}
          </Button>
          {inspirationSites.length >= MAX_INSPIRATION ? (
            <p className="text-[13px] text-ink-400">Five references is plenty to work from.</p>
          ) : null}
        </div>
      </QuestionBlock>

      <QuestionBlock
        id="q-competitors"
        question="Who are your main competitors?"
        help="We use this to make sure your website makes your advantage obvious."
        error={errors.competitors}
      >
        <div className="space-y-4">
          {competitors.map((competitor, index) => (
            <Card key={competitor.id} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-ink-500">Competitor {index + 1}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeCompetitor(competitor.id)}
                  aria-label={`Remove competitor ${index + 1}`}
                  className="px-2"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Business name" htmlFor={`comp-name-${competitor.id}`}>
                    <Input
                      id={`comp-name-${competitor.id}`}
                      value={competitor.name ?? ""}
                      onChange={(event) =>
                        updateCompetitor(competitor.id, { name: event.target.value })
                      }
                      placeholder="Sunshine Lock & Key"
                    />
                  </Field>
                  <Field label="Website" htmlFor={`comp-url-${competitor.id}`} optional>
                    <Input
                      id={`comp-url-${competitor.id}`}
                      type="url"
                      inputMode="url"
                      value={competitor.url ?? ""}
                      onChange={(event) =>
                        updateCompetitor(competitor.id, { url: event.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </Field>
                </div>
                <Field label="Notes" htmlFor={`comp-notes-${competitor.id}`} optional>
                  <EnhanceableTextarea
                    field="competitor-notes"
                    id={`comp-notes-${competitor.id}`}
                    rows={2}
                    value={competitor.notes ?? ""}
                    onChange={(notes) => updateCompetitor(competitor.id, { notes })}
                    placeholder="They rank first on Google but their site is slow and has no reviews."
                  />
                </Field>
              </div>
            </Card>
          ))}
          <Button variant="secondary" onClick={addCompetitor}>
            <Plus className="size-4" />
            {competitors.length ? "Add another competitor" : "Add a competitor"}
          </Button>
        </div>
      </QuestionBlock>
    </div>
  );
}
