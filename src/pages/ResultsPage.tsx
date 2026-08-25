import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Download,
  Pencil,
  RotateCcw,
  Rocket,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Modal } from "@/components/ui/Modal";
import { Prose } from "@/components/report/Prose";
import { FactList, ReportSection } from "@/components/report/ReportSection";
import { SitemapViewer } from "@/components/report/SitemapViewer";
import { HomepagePlanViewer } from "@/components/report/HomepagePlanViewer";
import { PromptViewer } from "@/components/report/PromptViewer";
import { generateReport } from "@/services/reportGenerator";
import { generatePlanDocument, generateWebsitePrompt } from "@/services/promptGenerator";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";
import { isProjectReadyForReport } from "@/schemas/projectSchema";
import { downloadTextFile, slugify } from "@/utils/download";
import { cn } from "@/utils/cn";

type TabId =
  | "overview"
  | "strategy"
  | "pages"
  | "homepage"
  | "design"
  | "features"
  | "seo"
  | "prompt";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "strategy", label: "Strategy" },
  { id: "pages", label: "Pages" },
  { id: "homepage", label: "Homepage" },
  { id: "design", label: "Design" },
  { id: "features", label: "Features" },
  { id: "seo", label: "SEO" },
  { id: "prompt", label: "Website Prompt" },
];

type PromptTab = "plan" | "brief" | "prompt";

export function ResultsPage() {
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.project);
  const hydrated = useProjectStore((state) => state.hydrated);
  const resetProject = useProjectStore((state) => state.resetProject);

  const [tab, setTab] = useState<TabId>("overview");
  const [promptTab, setPromptTab] = useState<PromptTab>("prompt");
  const [showPhase2, setShowPhase2] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  const ready = isProjectReadyForReport(project);

  useEffect(() => {
    if (hydrated && !ready) navigate("/plan/basics", { replace: true });
  }, [hydrated, ready, navigate]);

  const report = useMemo(() => generateReport(project), [project]);
  const prompt = useMemo(() => generateWebsitePrompt(project, report), [project, report]);
  const planDocument = useMemo(() => generatePlanDocument(project, report), [project, report]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tab]);

  if (!ready) return null;

  const businessName = project.business.name || "your business";
  const fileSlug = slugify(project.business.name);

  const editAnswers = () => navigate("/plan/review");

  const promptSource: Record<PromptTab, { label: string; value: string; meta: string }> = {
    plan: {
      label: "Website plan",
      value: planDocument,
      meta: "Human-readable version to share with your team",
    },
    brief: {
      label: "Developer brief",
      value: report.developerBrief,
      meta: "Technical version for a developer or agency",
    },
    prompt: {
      label: "AI website prompt",
      value: prompt,
      meta: `${prompt.split(/\s+/).length.toLocaleString()} words · ready to paste into an AI website builder`,
    },
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-20 border-b border-ink-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={editAnswers}>
              <Pencil className="size-3.5" />
              <span className="hidden sm:inline">Edit answers</span>
            </Button>
            <CopyButton value={prompt} label="Copy prompt" what="Website prompt copied" variant="primary" size="sm" />
          </div>
        </div>

        <nav aria-label="Report sections" className="border-t border-ink-100">
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
            <ul className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-2">
              {TABS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setTab(item.id)}
                    aria-current={tab === item.id ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      tab === item.id
                        ? "bg-ink-950 text-white"
                        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10">
          <p className="text-[13px] font-medium uppercase tracking-wider text-cobalt-600">
            Your website plan
          </p>
          <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-tight text-ink-950 sm:text-[40px]">
            {businessName}
          </h1>
        </div>

        {tab === "overview" ? (
          <div className="space-y-12">
            <ReportSection title="Business overview">
              <Prose text={report.businessSummary} />
              {project.business.description.trim() ? (
                <blockquote className="rounded-2xl border-l-2 border-cobalt-300 bg-white px-5 py-4">
                  <p className="text-[13px] font-medium uppercase tracking-wider text-ink-400">
                    In your words
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
                    {project.business.description.trim()}
                  </p>
                </blockquote>
              ) : null}
              <FactList facts={report.businessFacts} />
            </ReportSection>

            <ReportSection
              title="What you'll get"
              description="Everything below was generated from your answers, and updates whenever you change them."
            >
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {[
                  `${report.sitemap.length} recommended pages`,
                  `${report.homepagePlan.length} homepage sections`,
                  `${report.functionality.required.length} required features`,
                  `${report.searchThemes.length} search themes`,
                  `${report.contentRecommendations.length} content directives`,
                  `A ${prompt.split(/\s+/).length.toLocaleString()}-word build prompt`,
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-ink-200 bg-white px-4 py-3 text-[14px] font-medium text-ink-800"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-cobalt-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </ReportSection>
          </div>
        ) : null}

        {tab === "strategy" ? (
          <ReportSection
            title="Website strategy"
            description="How the site should be positioned, and what every page is working toward."
            action={<CopyButton value={report.websiteStrategy} what="Strategy copied" />}
          >
            <Prose text={report.websiteStrategy} />
          </ReportSection>
        ) : null}

        {tab === "pages" ? (
          <ReportSection
            title="Website structure"
            description="The pages your site needs, and what each one is for."
            action={
              <CopyButton
                value={report.sitemap
                  .flatMap((page) => [
                    page.title,
                    ...(page.children ?? []).map((child) => `  ${child.title}`),
                  ])
                  .join("\n")}
                what="Sitemap copied"
              />
            }
          >
            <SitemapViewer pages={report.sitemap} />
          </ReportSection>
        ) : null}

        {tab === "homepage" ? (
          <ReportSection
            title="Homepage architecture"
            description="Section by section, in order, with what belongs in each."
          >
            <HomepagePlanViewer plan={report.homepagePlan} />
          </ReportSection>
        ) : null}

        {tab === "design" ? (
          <ReportSection
            title="Design direction"
            description="The visual system your website should be built on."
            action={<CopyButton value={report.designDirection} what="Design direction copied" />}
          >
            <Prose text={report.designDirection} />
            <FactList facts={report.designFacts} />
          </ReportSection>
        ) : null}

        {tab === "features" ? (
          <ReportSection
            title="Feature recommendations"
            description="What your website needs to do, split into what's required and what's worth considering."
          >
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-500">
                  Required
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {report.functionality.required.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-ink-200 bg-white px-4 py-3 text-[14px] text-ink-800"
                    >
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-cobalt-600"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {report.functionality.optional.length ? (
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-500">
                    Optional
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {report.functionality.optional.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 rounded-xl border border-dashed border-ink-300 px-4 py-3 text-[14px] text-ink-600"
                      >
                        <Circle className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </ReportSection>
        ) : null}

        {tab === "seo" ? (
          <ReportSection
            title="Getting found"
            description="How this website should be structured so the right customers reach it."
            action={<CopyButton value={report.searchThemes.join("\n")} label="Copy terms" what="Search terms copied" />}
          >
            <Prose text={report.seoStrategy} />
            <div>
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-500">
                Primary search themes
              </h3>
              <ul className="flex flex-wrap gap-2">
                {report.searchThemes.map((theme) => (
                  <li
                    key={theme}
                    className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-[13px] font-medium text-ink-700"
                  >
                    {theme}
                  </li>
                ))}
              </ul>
            </div>
            {report.locationPages.length ? (
              <div>
                <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-500">
                  Recommended service + location pages
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {report.locationPages.map((page) => (
                    <li
                      key={page}
                      className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-[14px] text-ink-800"
                    >
                      {page}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div>
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-500">
                Content notes
              </h3>
              <ul className="space-y-2">
                {report.contentRecommendations.map((item, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ReportSection>
        ) : null}

        {tab === "prompt" ? (
          <ReportSection
            title="Website generation prompt"
            description="Three versions of the same plan. The AI website prompt is the one to paste into a website generator."
          >
            <div className="flex flex-wrap gap-1.5">
              {(["plan", "brief", "prompt"] as PromptTab[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPromptTab(id)}
                  aria-pressed={promptTab === id}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors",
                    promptTab === id
                      ? "bg-ink-950 text-white"
                      : "border border-ink-200 bg-white text-ink-600 hover:bg-ink-50",
                  )}
                >
                  {promptSource[id].label}
                </button>
              ))}
            </div>
            <PromptViewer
              value={promptSource[promptTab].value}
              label={promptSource[promptTab].label}
              meta={promptSource[promptTab].meta}
            />
          </ReportSection>
        ) : null}

        {/* Closing actions */}
        <section className="mt-16 rounded-2xl border border-ink-200 bg-white p-6 sm:p-8">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink-950 sm:text-[26px]">
            Your website blueprint is ready.
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            Copy the prompt into an AI website builder, or hand the developer brief to whoever is
            building your site. Change any answer and everything here regenerates.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <CopyButton value={prompt} label="Copy website prompt" what="Website prompt copied" variant="primary" size="lg" />
            <Button variant="secondary" size="lg" onClick={editAnswers}>
              <Pencil className="size-4" />
              Edit my answers
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const filename = `${fileSlug}-website-plan.md`;
                downloadTextFile(filename, planDocument);
                toast.success("Download started", { description: filename });
              }}
            >
              <Download className="size-4" />
              Download website plan
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setConfirmRestart(true)}>
              <RotateCcw className="size-4" />
              Start over
            </Button>
          </div>

          <div className="mt-8 border-t border-ink-100 pt-7">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => setShowPhase2(true)} className="bg-cobalt-600 hover:bg-cobalt-700">
                <Rocket className="size-4" />
                Build my website
              </Button>
              <span className="rounded-lg bg-ink-100 px-2.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-500">
                Coming in Phase 2
              </span>
            </div>
          </div>
        </section>
      </main>

      <Modal
        open={showPhase2}
        onClose={() => setShowPhase2(false)}
        title="Website generation"
        description={
          <>
            <p>Your website plan is ready.</p>
            <p className="mt-3">
              In the next phase, you'll be able to turn this plan directly into a working website -
              generated from the prompt above, previewed in the browser, and refined until you
              approve it.
            </p>
            <p className="mt-3">
              Until then, copy the prompt and use it with any AI website builder or hand it to your
              developer.
            </p>
          </>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPhase2(false)}>
              Close
            </Button>
            <CopyButton value={prompt} label="Copy prompt" what="Website prompt copied" variant="primary" size="md" />
          </>
        }
      />

      <Modal
        open={confirmRestart}
        onClose={() => setConfirmRestart(false)}
        title="Start over?"
        description="This permanently deletes your answers and this plan from your browser."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmRestart(false)}>
              Keep my plan
            </Button>
            <Button
              onClick={() => {
                resetProject();
                navigate("/");
                toast.success("Plan deleted", {
                  description: "Your answers were removed from this browser.",
                });
              }}
            >
              Delete and start over
            </Button>
          </>
        }
      />
    </div>
  );
}
