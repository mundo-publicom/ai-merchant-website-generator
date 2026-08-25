import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { YesNo } from "@/components/ui/YesNo";
import { TagInput } from "@/components/ui/TagInput";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";

export function LocationGroup({ errors }: GroupProps) {
  const location = useProjectStore((state) => state.project.location);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof location>) => patch("location", value);

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-visit"
        question="Do customers visit your physical location?"
        error={errors.customersVisitLocation}
      >
        <YesNo
          name="Customers visit your location"
          value={location.customersVisitLocation}
          onChange={(value) => update({ customersVisitLocation: value })}
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-serves"
        question="Do you go to your customers?"
        help="On-site work, deliveries, house calls or mobile service."
        error={errors.servesCustomerLocations}
      >
        <YesNo
          name="You travel to customers"
          value={location.servesCustomerLocations}
          onChange={(value) => update({ servesCustomerLocations: value })}
        />
      </QuestionBlock>

      {location.servesCustomerLocations ? (
        <QuestionBlock
          id="q-areas"
          question="Which areas do you serve?"
          help="Cities, counties, regions - or type “Nationwide”. Each of these can become its own page, which is how local customers find you."
          error={errors.serviceAreas}
        >
          <TagInput
            id="service-areas"
            value={location.serviceAreas}
            onChange={(serviceAreas) => update({ serviceAreas })}
            placeholder="Miami, Coral Gables, Hialeah"
            invalid={Boolean(errors.serviceAreas)}
          />
        </QuestionBlock>
      ) : null}

      <QuestionBlock
        id="q-address"
        question="Business address"
        help={
          location.customersVisitLocation
            ? "This appears on your contact page, your map and in search results."
            : "Optional, but a local address still helps you show up in local searches."
        }
      >
        <div className="space-y-5">
          <Field label="Street address" htmlFor="address" optional={!location.customersVisitLocation}>
            <Input
              id="address"
              value={location.address ?? ""}
              onChange={(event) => update({ address: event.target.value })}
              placeholder="1450 NW 27th Ave"
              autoComplete="street-address"
            />
          </Field>
          <Field label="Address line 2" htmlFor="address2" optional>
            <Input
              id="address2"
              value={location.address2 ?? ""}
              onChange={(event) => update({ address2: event.target.value })}
              placeholder="Suite 200"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" htmlFor="city" error={errors.city}>
              <Input
                id="city"
                value={location.city ?? ""}
                onChange={(event) => update({ city: event.target.value })}
                placeholder="Miami"
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.city)}
              />
            </Field>
            <Field label="State / region" htmlFor="state" optional>
              <Input
                id="state"
                value={location.state ?? ""}
                onChange={(event) => update({ state: event.target.value })}
                placeholder="FL"
                autoComplete="address-level1"
              />
            </Field>
            <Field label="Postal code" htmlFor="postal" optional>
              <Input
                id="postal"
                value={location.postalCode ?? ""}
                onChange={(event) => update({ postalCode: event.target.value })}
                placeholder="33125"
                autoComplete="postal-code"
              />
            </Field>
            <Field label="Country" htmlFor="country" optional>
              <Input
                id="country"
                value={location.country ?? ""}
                onChange={(event) => update({ country: event.target.value })}
                placeholder="United States"
                autoComplete="country-name"
              />
            </Field>
          </div>
        </div>
      </QuestionBlock>
    </div>
  );
}
