# WebBlueprint - Merchant Website Discovery & Prompt Builder

Phase 1 of a two-phase product. A business owner answers plain-language questions about their
business; the app turns those answers into a complete website specification and a detailed,
AI-ready website-generation prompt.

**Phase 1 does not generate websites.** The "Build my website" button is present and clearly
marked as a Phase 2 entry point.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Zustand · Zod · React Router ·
lucide-react. No backend, no API keys, no database. Progress is persisted to `localStorage`
under the key `merchantWebsiteProject`.

## The flow

```
Landing ──▶ /plan/:stepId  (10 steps) ──▶ /generating ──▶ /results
```

| # | Step | Covers |
|---|------|--------|
| 1 | `basics` | New build or redesign · the current site (redesign only) · business identity |
| 2 | `market` | Location, service area, and who the customers are |
| 3 | `services` | Products and services, ordered by importance |
| 4 | `goals` | Website goals · primary and secondary call to action · how customers search |
| 5 | `brand` | Logo, colours, personality, existing assets |
| 6 | `design` | Style direction · inspiration and competitors |
| 7 | `features` | Content to include · functionality |
| 8 | `structure` | Recommended pages and homepage sections |
| 9 | `contact` | Contact details, hours, trust signals, testimonials |
| 10 | `review` | Every answer, with an edit link per section |

Steps are declared once in [`src/store/wizardSteps.ts`](src/store/wizardSteps.ts); the progress
rail, review screen and navigation all derive from that single list. Within a step, related
questions are grouped by [`StepGroup`](src/components/wizard/StepGroup.tsx) - the same questions
as before, on a third of the screens.

**The URL is the single source of truth for the current step.** The store mirrors it so a refresh
resumes exactly where the merchant left off, and never navigates by itself.

## The home page

The landing page is composed in [`pages/LandingPage.tsx`](src/pages/LandingPage.tsx) from one
component per section, all of them in [`components/landing/`](src/components/landing/):

| Section | Answers |
| --- | --- |
| `Hero` | What is this? |
| `StatStrip` | What am I signing up for? - counts derived from the option lists, not hardcoded |
| `PlanPreview` | What do I end up holding? |
| `ValueProps` | Why does this work? |
| `Deliverables` | What's in the document? - mirrors the eight tabs of `ResultsPage` |
| `HowItWorks` | What do I actually do? - the ten topics come from `WIZARD_STEPS` |
| `BusinessModel` | What's the catch? |
| `Industries` | Is this for a business like mine? - grouped from `data/industries` |
| `Faq` | The objections, including the awkward ones |
| `ClosingCta` · `Footer` | The ask, repeated |

**The hero sets the vocabulary and the rest of the page borrows it.**
[`components/landing/primitives.tsx`](src/components/landing/primitives.tsx) holds the shared
pieces - the cobalt corner marks, the serif italic `Accent`, the mono `Eyebrow`, the ruled-grid
backdrops and the spring `Reveal`/`RevealGroup` wrappers - so a new section inherits the hero's
treatment instead of inventing its own. The surface utilities they build on (`grid-lines`,
`mask-radial-fade`, `mask-frame-fade`) are declared in [`src/index.css`](src/index.css).

One trap worth knowing: **a CSS mask on an element stops its children from ever registering as
in-view**, so anything animated with `whileInView` has to sit outside the masked box. The closing
CTA keeps its faded border in its own absolutely-positioned layer for exactly this reason.

## Architecture

```
src/
  components/
    ui/          Button, Input, Field, OptionCard, Chip, ChoiceChips, SearchSelect,
                 TagInput, ColorPicker, Slider, YesNo, Modal, CopyButton, Card, Toast
    forms/       AssetUploader, BusinessHoursEditor, EnhanceableTextarea, image downscaling
    layout/      Logo
    landing/     Hero + one component per home-page section, over shared `primitives`
    wizard/      WizardLayout, WizardProgress, SaveIndicator, QuestionBlock, StepGroup
      groups/    One component per topic (business, location, audience, …)
      steps/     One component per wizard step, composed from groups
    report/      Prose, ReportSection, SitemapViewer, HomepagePlanViewer, PromptViewer
  pages/         LandingPage, WizardPage, GeneratingPage, ResultsPage
  data/          industries, features, designStyles, options, emptyProject, demoProject
  schemas/       projectSchema.ts - Zod schemas + per-step validation
  services/      recommendations, reportGenerator, promptGenerator, reviewSummary
  store/         useProjectStore.ts, useToastStore.ts, wizardSteps.ts
  types/         project.ts
  utils/         storage, formatting, download, id, cn

vite-plugins/
  enhanceApi.ts  Dev-server POST /api/enhance - keeps the API key off the client
```

### Where the intelligence lives

All generation is centralised in three service modules, none of which import React. Replacing
them with API calls in Phase 2 requires no UI changes.

| Module | Responsibility |
| --- | --- |
| [`services/recommendations.ts`](src/services/recommendations.ts) | Derives the sitemap, homepage sections and implied features from the answers. |
| [`services/reportGenerator.ts`](src/services/reportGenerator.ts) | `generateReport(project) → WebsiteReport` - business summary, strategy, sitemap, homepage plan, design direction, functionality, SEO, developer brief. |
| [`services/promptGenerator.ts`](src/services/promptGenerator.ts) | `generateWebsitePrompt(project, report) → string`, built from ~15 small section builders, plus `generatePlanDocument` for the human-readable version. |
| [`services/aiEnhance.ts`](src/services/aiEnhance.ts) | Client for the optional per-field AI enhancement endpoint. See below. |

The report and prompt are **derived on render** from project state, so editing any answer and
returning to `/results` regenerates everything.

### Recommendations vs. hand edits

`recommendPages` / `recommendHomepageSections` run when the merchant reaches the structure step,
and again whenever an answer that feeds them changes. The moment they rename, reorder, add,
remove or hide anything, `content.structureTouched` flips to `true` and their version is
preserved from then on - the report stops recomputing it. "Reset to recommendation" clears the
flag.

## AI enhancement (optional)

Every long-answer field in the wizard has a **✨ Enhance** button that rewrites the merchant's
answer with an LLM - grounded in what they have already told us, and undoable in one click.

```bash
cp .env.example .env.local          # then add your key
echo "OPENAI_API_KEY=sk-..." >> .env.local
npm run dev                         # restart after changing the key
```

**The key never reaches the browser.** The request is handled by a dev-server middleware
([`vite-plugins/enhanceApi.ts`](vite-plugins/enhanceApi.ts)) mounted at `POST /api/enhance`. It
has no `VITE_` prefix, so Vite will not inline it into the bundle. `GET /api/enhance` reports
whether a key is configured, and the client hides every Enhance button when it isn't - the
feature is invisible rather than broken when unconfigured.

- Provider: OpenAI Responses API (`openai` SDK, a devDependency - the browser never imports it).
- Model: `gpt-5.6` by default, override with `OPENAI_MODEL`. `OPENAI_BASE_URL` points at Azure
  OpenAI or any compatible gateway.
- Fields and their per-field prompts live in
  [`src/services/enhanceFields.ts`](src/services/enhanceFields.ts), shared by the browser and the
  endpoint so the two cannot drift.
- Only a trimmed slice of the project is sent as grounding context (business name, industry,
  location, service areas, service names, audience, primary CTA, brand words) - never the whole
  project.

### Two deliberate constraints

**The model may not invent facts.** The system instructions forbid adding prices, dates, years in
business, certifications, licence numbers, awards, review counts, response times or guarantees
that aren't already in the answer or the context. A website brief full of invented credentials
would produce a website full of false claims.

**Testimonials get "Tidy up", not "Enhance".** Rewriting a customer's words would manufacture a
testimonial the customer never gave - which is what fake-review law exists to prevent. That field
runs in `tidy` mode: spelling, punctuation and capitalisation only, with explicit instructions not
to change phrasing, tone or claims. Every other field runs in `rewrite` mode.

### For production

The dev-server middleware is a development convenience, not a deployed backend. To ship this,
deploy the same handler as a serverless function and set `VITE_ENHANCE_URL` to its address - the
client already reads that variable, so no other change is needed. See
[Deploying to GitHub Pages](#deploying-to-github-pages) for why the key can never live in the
static build itself.

## Deploying to GitHub Pages

Pushing to `main` builds and publishes the site via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). One-time setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Push to `main`. The site lands at `https://<user>.github.io/<repo>/`.

Three things make the SPA work on static hosting:

- **`BASE_PATH`** - the workflow sets it to `/<repo>/` so assets resolve under the project path.
  On a custom domain or a `<user>.github.io` repo, set it to `/` instead.
- **`basename`** - `BrowserRouter` reads `import.meta.env.BASE_URL`, so routes stay correct
  under that prefix.
- **`404.html`** - [`vite-plugins/spaFallback.ts`](vite-plugins/spaFallback.ts) copies
  `index.html` to `404.html` at build time. Pages has no rewrite rules, so a deep link like
  `/plan/basics` is served from `404.html` with the URL intact, and React Router resolves it.

### Environment variables on GitHub Pages

**GitHub Pages is static hosting. Anything the build inlines ships to every visitor.** Vite only
inlines variables prefixed `VITE_`, so the rule is simple:

| Variable | Where it goes | Safe on Pages? |
| --- | --- | --- |
| `VITE_ENHANCE_URL` | Repository **variable** | Yes - it is a public URL |
| `OPENAI_API_KEY` | Nowhere near this build | **No.** It would be readable in the bundle |

To set the public one: **Settings → Secrets and variables → Actions → Variables → New repository
variable**, named `VITE_ENHANCE_URL`. The workflow passes it through at build time.

Do not add `OPENAI_API_KEY` as an Actions secret for this workflow. A GitHub secret is only
hidden in the Actions *log* - if the build inlines it, it is published in plain text in the
JavaScript. There is no way to keep a key private in a static site, because there is no server
to hold it.

### So how does AI enhancement work in production?

It doesn't run on Pages, and that is handled gracefully: nothing answers `/api/enhance`, the
availability probe fails, and every Enhance button stays hidden. The rest of the app - the
wizard, the plan, the generated prompt - works fully.

To turn the feature on, put the key on a server you control:

1. Deploy the handler in [`vite-plugins/enhanceApi.ts`](vite-plugins/enhanceApi.ts) as a
   serverless function (Vercel, Netlify, Cloudflare Workers).
2. Set `OPENAI_API_KEY` in **that platform's** environment - it stays server-side there.
3. Enable CORS on it for your Pages origin.
4. Set the `VITE_ENHANCE_URL` repository variable to the function's URL and re-run the workflow.

### Keeping keys out of the repo

`.env` and `.env.*` are gitignored; only `.env.example` (placeholders) is committed. Before your
first push, confirm nothing real is staged:

```bash
git status --porcelain | grep -E '\.env' || echo "no env files staged"
```

## Try it without filling anything in

The landing page has **Try with an example business**, which loads a fully populated example
(a Miami locksmith, in [`src/data/demoProject.ts`](src/data/demoProject.ts)) and jumps straight
to the finished plan. The generated prompt for that example is ~2,700 words.

## Phase 2 boundary

- `MerchantWebsiteProject.generation` is declared in the types and never written to in Phase 1.
- Future endpoints are documented but unimplemented: `POST /api/projects`,
  `POST /api/projects/:id/report`, `POST /api/projects/:id/generate-prompt`,
  `POST /api/projects/:id/generate-website`.
- Clicking **Build my website** opens a "coming in Phase 2" modal.

## Notes on the spec

- **shadcn/ui** was not installed. The component set needed here is small and specific, so the
  primitives in `components/ui/` are hand-written against the same Radix-free Tailwind
  conventions. Nothing depends on a component registry.
- **React Hook Form** was dropped. Every field is bound to the Zustand store so answers autosave
  and the recommendation engine can react to them live; a second form state layer would have
  duplicated that. Validation still runs through centralised Zod schemas
  (`schemas/projectSchema.ts`), invoked per step on *Continue*.
- Wizard screens live in `components/wizard/steps/` rather than `pages/`, since only four things
  are actually routed (landing, wizard shell, generating, results). Each step composes topic
  components from `components/wizard/groups/`, so regrouping questions across steps is a change
  to one small file rather than a rewrite.
- **Toasts** are a two-file system: `store/useToastStore.ts` exposes an imperative `toast.*` API
  callable from anywhere (including the store and services), and `components/ui/Toast.tsx`
  renders them. They are used for outcomes that happen away from the control the merchant just
  used - a save that silently failed, a clipboard write, a blocked *Continue*, a rejected upload.
  Inline field errors are still the primary signal; toasts never replace them.

## Accessibility & responsiveness

Semantic landmarks, one `h1` per screen, labelled inputs, `role="radio"`/`role="checkbox"`
option cards with `aria-checked`, `role="alert"` errors, visible focus rings, 44px minimum tap
targets, and `prefers-reduced-motion` support. The whole wizard was walked end to end at 390px
with no horizontal scrolling.
