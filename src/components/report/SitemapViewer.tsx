import { FileText, Folder } from "lucide-react";
import type { WebsitePage } from "@/types/project";

export function SitemapViewer({ pages }: { pages: WebsitePage[] }) {
  return (
    <ul className="space-y-2.5">
      {pages.map((page) => (
        <li key={page.id}>
          <div className="rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
                {page.children?.length ? (
                  <Folder className="size-4" aria-hidden="true" />
                ) : (
                  <FileText className="size-4" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink-950">{page.title}</p>
                {page.purpose ? (
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-500">{page.purpose}</p>
                ) : null}
                {page.children?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {page.children.map((child) => (
                      <li
                        key={child.id}
                        className="rounded-lg bg-ink-50 px-2.5 py-1.5 text-[13px] font-medium text-ink-700"
                      >
                        {child.title}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
