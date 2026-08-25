import { Plus, Star, Trash2 } from "lucide-react";
import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { EnhanceableTextarea } from "@/components/forms/EnhanceableTextarea";
import { TRUST_FACTORS } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";
import { cn } from "@/utils/cn";

export function TrustGroup({ errors }: GroupProps) {
  const trust = useProjectStore((state) => state.project.trust);
  const patch = useProjectStore((state) => state.patch);
  const addTestimonial = useProjectStore((state) => state.addTestimonial);
  const updateTestimonial = useProjectStore((state) => state.updateTestimonial);
  const removeTestimonial = useProjectStore((state) => state.removeTestimonial);
  const update = (value: Partial<typeof trust>) => patch("trust", value);

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-trust"
        question="What helps customers trust your business?"
        help="Select everything that's genuinely true. These become the credibility signals on your site."
      >
        <ChoiceChips
          options={TRUST_FACTORS}
          value={trust.trustFactors}
          onChange={(trustFactors) => update({ trustFactors })}
          allowOther
          otherPlaceholder="Something else"
        />
      </QuestionBlock>

      {trust.trustFactors.length ? (
        <QuestionBlock
          id="q-trust-details"
          question="Add the specifics"
          help="Numbers and names are far more convincing than adjectives. License numbers, years, review counts, awards."
        >
          <EnhanceableTextarea
            field="trust-details"
            rows={3}
            value={trust.details ?? ""}
            onChange={(details) => update({ details })}
            placeholder="Licensed (FL DABT #B2900123), fully insured, 14,000+ jobs since 2009, 4.9 stars across 680 Google reviews."
            aria-labelledby="q-trust-details"
          />
        </QuestionBlock>
      ) : null}

      <QuestionBlock
        id="q-testimonials"
        question="Do you have customer testimonials you'd like to include?"
        help="Add them exactly as the customer wrote them. Real wording always outperforms polished marketing copy."
        error={errors.testimonials}
      >
        <div className="space-y-4">
          {trust.testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-ink-500">
                  Testimonial {index + 1}
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  className="px-2"
                  aria-label={`Remove testimonial ${index + 1}`}
                  onClick={() => removeTestimonial(testimonial.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <Field label="What did they say?" htmlFor={`tst-quote-${testimonial.id}`}>
                  <EnhanceableTextarea
                    field="testimonial-quote"
                    id={`tst-quote-${testimonial.id}`}
                    rows={3}
                    value={testimonial.quote}
                    onChange={(quote) => updateTestimonial(testimonial.id, { quote })}
                    placeholder="Locked out at 1am with my kid in the car. They had me back in within 25 minutes."
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Customer name" htmlFor={`tst-author-${testimonial.id}`}>
                    <Input
                      id={`tst-author-${testimonial.id}`}
                      value={testimonial.author}
                      onChange={(event) =>
                        updateTestimonial(testimonial.id, { author: event.target.value })
                      }
                      placeholder="Daniela R."
                    />
                  </Field>
                  <Field label="Source" htmlFor={`tst-source-${testimonial.id}`} optional>
                    <Input
                      id={`tst-source-${testimonial.id}`}
                      value={testimonial.source ?? ""}
                      onChange={(event) =>
                        updateTestimonial(testimonial.id, { source: event.target.value })
                      }
                      placeholder="Google"
                    />
                  </Field>
                </div>
                <Field label="Rating" optional>
                  <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        role="radio"
                        aria-checked={testimonial.rating === rating}
                        aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                        onClick={() => updateTestimonial(testimonial.id, { rating })}
                        className="rounded p-1"
                      >
                        <Star
                          className={cn(
                            "size-6 transition-colors",
                            (testimonial.rating ?? 0) >= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-ink-300",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </Card>
          ))}
          <Button variant="secondary" onClick={addTestimonial}>
            <Plus className="size-4" />
            {trust.testimonials.length ? "Add another testimonial" : "Add a testimonial"}
          </Button>
        </div>
      </QuestionBlock>
    </div>
  );
}
