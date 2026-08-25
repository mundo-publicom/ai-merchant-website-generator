import { useEffect } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, RefreshCw, Trash2 } from "lucide-react";
import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";
import { cn } from "@/utils/cn";

export function StructureGroup() {
  const content = useProjectStore((state) => state.project.content);
  const refreshStructure = useProjectStore((state) => state.refreshStructure);
  const addPage = useProjectStore((state) => state.addPage);
  const updatePage = useProjectStore((state) => state.updatePage);
  const removePage = useProjectStore((state) => state.removePage);
  const movePage = useProjectStore((state) => state.movePage);
  const toggleSection = useProjectStore((state) => state.toggleSection);
  const moveSectionItem = useProjectStore((state) => state.moveSectionItem);

  // A stable digest of everything the recommendation reads, so the effect below
  // re-runs on a real change rather than on every keystroke in the wizard.
  const structureInputs = useProjectStore((state) =>
    [
      state.project.business.industry,
      state.project.business.locationCount,
      state.project.content.requiredContent.join(","),
      state.project.features.join(","),
      state.project.goals.goals.join(","),
      state.project.services.map((service) => service.name).join(","),
      state.project.location.serviceAreas.join(","),
      state.project.location.customersVisitLocation,
      state.project.trust.trustFactors.join(","),
      state.project.trust.testimonials.length,
    ].join("|"),
  );

  // Keep the recommendation in step with the answers behind it - until the
  // merchant edits the structure by hand, at which point `refreshStructure`
  // becomes a no-op and their version is left alone.
  useEffect(() => {
    refreshStructure();
  }, [refreshStructure, structureInputs]);

  const enabledCount = content.homepageSections.filter((section) => section.enabled).length;

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-pages"
        question="Recommended website structure"
        help="Built from everything you've told us. Rename, reorder, add or remove anything."
      >
        <div className="space-y-3">
          <ul className="space-y-2.5">
            {content.pages.map((page, index) => (
              <li key={page.id}>
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={page.title}
                      onChange={(event) => updatePage(page.id, { title: event.target.value })}
                      aria-label={`Page ${index + 1} name`}
                      className="h-11 flex-1 border-transparent bg-transparent px-2 font-medium hover:border-ink-200"
                    />
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        aria-label={`Move ${page.title} up`}
                        disabled={index === 0}
                        onClick={() => movePage(page.id, -1)}
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        aria-label={`Move ${page.title} down`}
                        disabled={index === content.pages.length - 1}
                        onClick={() => movePage(page.id, 1)}
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="px-2"
                        aria-label={`Remove ${page.title}`}
                        onClick={() => removePage(page.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {page.purpose ? (
                    <p className="px-2 pb-1 text-[13px] leading-relaxed text-ink-500">
                      {page.purpose}
                    </p>
                  ) : null}
                  {page.children?.length ? (
                    <ul className="mt-2 space-y-1 border-l-2 border-ink-100 pl-4">
                      {page.children.map((child) => (
                        <li
                          key={child.id}
                          className="flex items-center justify-between gap-2 py-1 text-[14px] text-ink-600"
                        >
                          <span>{child.title}</span>
                          <button
                            type="button"
                            onClick={() => removePage(child.id)}
                            aria-label={`Remove ${child.title}`}
                            className="rounded-md p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-red-600"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => addPage()}>
              <Plus className="size-4" />
              Add page
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                refreshStructure(true);
                toast.info("Structure reset", {
                  description: "Pages and homepage sections were rebuilt from your answers.",
                });
              }}
            >
              <RefreshCw className="size-4" />
              Reset to recommendation
            </Button>
          </div>
        </div>
      </QuestionBlock>

      <QuestionBlock
        id="q-homepage"
        question="Your homepage, section by section"
        help={`${enabledCount} sections in this order. Turn off anything you don't want, or move sections up and down.`}
      >
        <ol className="space-y-2.5">
          {content.homepageSections.map((section, index) => (
            <li key={section.id}>
              <Card
                className={cn(
                  "flex items-start gap-3 p-4 transition-opacity",
                  !section.enabled && "opacity-55",
                )}
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-ink-100 text-[12px] font-semibold text-ink-600">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-ink-900">{section.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{section.purpose}</p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    aria-label={`Move ${section.title} up`}
                    disabled={index === 0}
                    onClick={() => moveSectionItem(section.id, -1)}
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    aria-label={`Move ${section.title} down`}
                    disabled={index === content.homepageSections.length - 1}
                    onClick={() => moveSectionItem(section.id, 1)}
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    aria-label={
                      section.enabled ? `Hide ${section.title}` : `Show ${section.title}`
                    }
                    aria-pressed={section.enabled}
                    onClick={() => toggleSection(section.id)}
                  >
                    {section.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </QuestionBlock>
    </div>
  );
}
