import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { toast } from "@/store/useToastStore";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  value: string;
  label?: string;
  copiedLabel?: string;
  /** Named in the toast, e.g. "Website prompt copied". */
  what?: string;
}

/** Copies to the clipboard, falling back to a hidden textarea on older browsers. */
async function writeToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Clipboard API unavailable (insecure context or denied permission).
  }

  const area = document.createElement("textarea");
  area.value = value;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(area);
  }
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  what = "Copied to clipboard",
  variant = "secondary",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const ok = await writeToClipboard(value);
    setCopied(ok);
    if (ok) {
      toast.success(what, { key: "clipboard" });
    } else {
      toast.error("Couldn't reach your clipboard", {
        description: "Select the text and press Ctrl+C (or ⌘C) to copy it by hand.",
        key: "clipboard",
      });
    }
  };

  return (
    <Button variant={variant} size={size} onClick={() => void copy()} {...props}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
