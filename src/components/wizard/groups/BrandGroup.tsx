import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { YesNo } from "@/components/ui/YesNo";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { AssetUploader } from "@/components/forms/AssetUploader";
import { AVAILABLE_ASSETS, BRAND_PERSONALITY } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";

const NO_ASSETS = "none";

/**
 * "Nothing yet" is exclusive: picking it clears the rest, and picking anything
 * else clears it. The previous rule kept "none" selected and silently dropped
 * whatever was added next.
 */
function reconcileAssets(previous: string[], next: string[]): string[] {
  const addedNone = next.includes(NO_ASSETS) && !previous.includes(NO_ASSETS);
  if (addedNone) return [NO_ASSETS];
  return next.length > 1 ? next.filter((value) => value !== NO_ASSETS) : next;
}

export function BrandGroup() {
  const branding = useProjectStore((state) => state.project.branding);
  const assets = useProjectStore((state) => state.project.assets);
  const patch = useProjectStore((state) => state.patch);

  const updateBranding = (value: Partial<typeof branding>) => patch("branding", value);
  const updateAssets = (value: Partial<typeof assets>) => patch("assets", value);

  const logoUploads = branding.logoPreview
    ? [{ id: "logo", name: branding.logoName ?? "Logo", preview: branding.logoPreview }]
    : [];

  return (
    <div className="space-y-8">
      <QuestionBlock id="q-logo" question="Do you already have a logo?">
        <div className="space-y-5">
          <YesNo
            name="Has a logo"
            value={branding.hasLogo}
            onChange={(hasLogo) =>
              updateBranding({
                hasLogo,
                ...(hasLogo ? {} : { logoPreview: undefined, logoName: undefined }),
              })
            }
          />
          {branding.hasLogo ? (
            <AssetUploader
              label={branding.logoPreview ? "Replace logo" : "Upload your logo"}
              variant="logo"
              multiple={false}
              uploads={logoUploads}
              onChange={(uploads) => {
                updateBranding({
                  logoPreview: uploads[0]?.preview,
                  logoName: uploads[0]?.name,
                });
                if (uploads[0]) toast.success("Logo added");
              }}
              onReject={(reason) => toast.warning(reason)}
            />
          ) : branding.hasLogo === false ? (
            <p className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-[14px] leading-relaxed text-ink-600">
              No problem. Your plan will include instructions to create a clean wordmark from your
              business name.
            </p>
          ) : null}
        </div>
      </QuestionBlock>

      <QuestionBlock
        id="q-colors"
        question="Do you have brand colours?"
        help="Add them if you know them. If you don't, skip this - your plan will specify a palette instead."
      >
        <ColorPicker
          colors={branding.colors}
          onChange={(colors) => updateBranding({ colors })}
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-personality"
        question="How should your brand come across?"
        help="Choose up to five. These words steer every design decision in your plan."
      >
        <ChoiceChips
          options={BRAND_PERSONALITY}
          value={branding.personality}
          onChange={(personality) => updateBranding({ personality })}
          max={5}
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-assets"
        question="What visual assets do you already have?"
        help="Real photography always beats stock. Knowing what exists changes how we design the pages."
      >
        <div className="space-y-5">
          <ChoiceChips
            options={AVAILABLE_ASSETS}
            value={assets.availableAssets}
            onChange={(next) => updateAssets({ availableAssets: reconcileAssets(assets.availableAssets, next) })}
          />
          {assets.availableAssets.some((value) => value !== NO_ASSETS) ? (
            <AssetUploader
              label="Add a few photos (optional)"
              uploads={assets.uploads}
              onChange={(uploads) => updateAssets({ uploads })}
              onReject={(reason) => toast.warning(reason)}
            />
          ) : null}
        </div>
      </QuestionBlock>
    </div>
  );
}
