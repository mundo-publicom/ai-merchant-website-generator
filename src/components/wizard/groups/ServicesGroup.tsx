import { ChevronDown, ChevronUp, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { EnhanceableTextarea } from "@/components/forms/EnhanceableTextarea";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";
import { cn } from "@/utils/cn";

export function ServicesGroup({ errors }: GroupProps) {
  const services = useProjectStore((state) => state.project.services);
  const primaryServiceId = useProjectStore((state) => state.project.primaryServiceId);
  const addService = useProjectStore((state) => state.addService);
  const updateService = useProjectStore((state) => state.updateService);
  const removeService = useProjectStore((state) => state.removeService);
  const moveService = useProjectStore((state) => state.moveService);
  const setPrimaryService = useProjectStore((state) => state.setPrimaryService);

  return (
    <div className="space-y-5">
      {services.length === 0 ? (
        <Card className="border-dashed p-8 text-center">
          <p className="text-[15px] font-medium text-ink-800">Nothing added yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-[14px] leading-relaxed text-ink-500">
            Add the services or products you want customers to find. Each one can become its own
            page.
          </p>
          <Button className="mt-5" onClick={() => addService()}>
            <Plus className="size-4" />
            Add your first service
          </Button>
        </Card>
      ) : null}

      <ul className="space-y-4">
        {services.map((service, index) => {
          const isPrimary = service.id === primaryServiceId;
          return (
            <li key={service.id}>
              <Card
                className={cn(
                  "p-5 transition-colors",
                  isPrimary ? "border-cobalt-300 bg-cobalt-50/40" : "",
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-ink-100 text-[12px] font-semibold text-ink-600">
                      {index + 1}
                    </span>
                    {isPrimary ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-cobalt-600 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        <Star className="size-3" fill="currentColor" />
                        Most important
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Move ${service.name || "service"} up`}
                      disabled={index === 0}
                      onClick={() => moveService(service.id, -1)}
                      className="px-2"
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Move ${service.name || "service"} down`}
                      disabled={index === services.length - 1}
                      onClick={() => moveService(service.id, 1)}
                      className="px-2"
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      aria-label={`Remove ${service.name || "service"}`}
                      onClick={() => removeService(service.id)}
                      className="px-2"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field label="Name" htmlFor={`service-name-${service.id}`}>
                    <Input
                      id={`service-name-${service.id}`}
                      value={service.name}
                      onChange={(event) => updateService(service.id, { name: event.target.value })}
                      placeholder="Emergency Lockout Service"
                    />
                  </Field>
                  <Field label="Description" htmlFor={`service-desc-${service.id}`} optional>
                    <EnhanceableTextarea
                      field="service-description"
                      id={`service-desc-${service.id}`}
                      rows={3}
                      value={service.description ?? ""}
                      onChange={(description) => updateService(service.id, { description })}
                      placeholder="24/7 response for home, car and business lockouts, usually on site within 30 minutes."
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Starting price" htmlFor={`service-price-${service.id}`} optional>
                      <Input
                        id={`service-price-${service.id}`}
                        value={service.price ?? ""}
                        onChange={(event) =>
                          updateService(service.id, { price: event.target.value })
                        }
                        placeholder="From $99"
                      />
                    </Field>
                    <Field label="Priority" htmlFor={`service-priority-${service.id}`}>
                      <div className="flex h-12 items-center gap-2">
                        <Button
                          variant={isPrimary ? "subtle" : "secondary"}
                          size="sm"
                          onClick={() => setPrimaryService(service.id)}
                          disabled={isPrimary}
                          id={`service-priority-${service.id}`}
                        >
                          <Star className="size-3.5" />
                          {isPrimary ? "Most important" : "Make most important"}
                        </Button>
                      </div>
                    </Field>
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      {services.length > 0 ? (
        <Button variant="secondary" onClick={() => addService()}>
          <Plus className="size-4" />
          Add another service
        </Button>
      ) : null}

      {errors.services ? (
        <p role="alert" data-field-error className="text-[13px] font-medium text-red-600">
          {errors.services}
        </p>
      ) : null}

      {services.length > 1 ? (
        <p className="text-[13px] leading-relaxed text-ink-500">
          The order above becomes the order on your homepage. Your most important service gets the
          most prominent placement.
        </p>
      ) : null}
    </div>
  );
}
