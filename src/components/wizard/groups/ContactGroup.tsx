import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { BusinessHoursEditor } from "@/components/forms/BusinessHoursEditor";
import { SOCIAL_NETWORKS } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";

export function ContactGroup({ errors }: GroupProps) {
  const contact = useProjectStore((state) => state.project.contact);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof contact>) => patch("contact", value);

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-contact"
        question="Contact details"
        help="At least one method is required. These appear in your header, footer and contact page."
        error={errors.contact}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Main phone" htmlFor="contact-phone" error={errors.phone}>
            <Input
              id="contact-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={contact.phone ?? ""}
              onChange={(event) => update({ phone: event.target.value })}
              placeholder="(305) 555-0142"
              aria-invalid={Boolean(errors.phone)}
            />
          </Field>
          <Field label="Secondary phone" htmlFor="contact-phone2" optional error={errors.secondaryPhone}>
            <Input
              id="contact-phone2"
              type="tel"
              inputMode="tel"
              value={contact.secondaryPhone ?? ""}
              onChange={(event) => update({ secondaryPhone: event.target.value })}
              placeholder="(305) 555-0188"
              aria-invalid={Boolean(errors.secondaryPhone)}
            />
          </Field>
          <Field label="Email" htmlFor="contact-email" error={errors.email}>
            <Input
              id="contact-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={contact.email ?? ""}
              onChange={(event) => update({ email: event.target.value })}
              placeholder="hello@yourbusiness.com"
              aria-invalid={Boolean(errors.email)}
            />
          </Field>
          <Field label="WhatsApp" htmlFor="contact-whatsapp" optional>
            <Input
              id="contact-whatsapp"
              type="tel"
              inputMode="tel"
              value={contact.whatsapp ?? ""}
              onChange={(event) => update({ whatsapp: event.target.value })}
              placeholder="+1 305 555 0142"
            />
          </Field>
        </div>
      </QuestionBlock>

      <QuestionBlock
        id="q-social"
        question="Social accounts"
        help="Only fill in the ones you actually use - empty profiles hurt more than they help."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_NETWORKS.map((network) => (
            <Field key={network.key} label={network.label} htmlFor={`social-${network.key}`} optional>
              <Input
                id={`social-${network.key}`}
                value={contact.social[network.key] ?? ""}
                onChange={(event) =>
                  update({ social: { ...contact.social, [network.key]: event.target.value } })
                }
                placeholder={network.placeholder}
              />
            </Field>
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock
        id="q-hours"
        question="Business hours"
        help="Shown in your footer, on your contact page, and in your Google listing data."
      >
        <BusinessHoursEditor />
      </QuestionBlock>
    </div>
  );
}
