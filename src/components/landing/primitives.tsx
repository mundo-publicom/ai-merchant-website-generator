import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Shared surface treatment for the landing page.
 *
 * The hero establishes the vocabulary - a dark band, a border that dissolves
 * at the edges, cobalt plus-marks pinned to the corners, a serif italic accent
 * inside the headline, and a spring entrance. Everything below the hero is
 * built from these pieces so the page reads as one surface rather than a stack
 * of unrelated blocks.
 */

/** `dark` = placed on ink-950. `light` = placed on canvas or white. */
export type Tone = "dark" | "light";

/** The hero's entrance spring, reused by every reveal on the page. */
const SPRING = { type: "spring", stiffness: 220, damping: 30 } as const;

/* -------------------------------------------------------------------------- */
/* Motion                                                                      */
/* -------------------------------------------------------------------------- */

/** Resolved once at module scope - `motion(Tag)` in a render body would hand
    React a brand-new component type on every pass and remount the subtree. */
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
} as const;

export type MotionTag = keyof typeof MOTION_TAGS;

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: MotionTag;
}) {
  const reduceMotion = useReducedMotion();
  const Motion = MOTION_TAGS[as];

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...SPRING, delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </Motion>
  );
}

/** Wraps a set of `RevealItem`s so they arrive one after another. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: MotionTag;
}) {
  const reduceMotion = useReducedMotion();
  const Motion = MOTION_TAGS[as];

  return (
    <Motion
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : stagger } },
      }}
    >
      {children}
    </Motion>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
}) {
  const reduceMotion = useReducedMotion();
  const Motion = MOTION_TAGS[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: SPRING },
  };

  return (
    <Motion className={className} variants={variants}>
      {children}
    </Motion>
  );
}

/* -------------------------------------------------------------------------- */
/* Section furniture                                                           */
/* -------------------------------------------------------------------------- */

/** Small uppercase label with a cobalt marker, above every section heading. */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em]",
        tone === "dark" ? "text-cobalt-300" : "text-cobalt-600",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-6",
          tone === "dark" ? "bg-cobalt-400/60" : "bg-cobalt-400",
        )}
      />
      {children}
    </span>
  );
}

/** The hero's serif italic emphasis, for one or two words inside a heading. */
export function Accent({ children, tone = "light" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={cn(
        "font-display font-normal italic",
        tone === "dark" ? "text-cobalt-300" : "text-cobalt-600",
      )}
    >
      {children}
    </span>
  );
}

/** Section heading matched to the hero's tracking and balance. */
export function SectionTitle({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-balance text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[40px]",
        tone === "dark" ? "text-white" : "text-ink-950",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionLead({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-2xl text-pretty text-[16px] leading-relaxed sm:text-[17px]",
        tone === "dark" ? "text-ink-300" : "text-ink-600",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Framing                                                                     */
/* -------------------------------------------------------------------------- */

const CORNERS = [
  "-left-3 -top-3",
  "-bottom-3 -left-3",
  "-right-3 -top-3",
  "-bottom-3 -right-3",
] as const;

/**
 * The hero's four cobalt plus-marks, scaled down for panels further down the
 * page. Purely decorative - the parent must be `relative`.
 */
export function CornerMarks({ tone = "light" }: { tone?: Tone }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {CORNERS.map((position, index) => (
        <motion.span
          key={position}
          aria-hidden="true"
          className={cn(
            "absolute z-10",
            position,
            tone === "dark" ? "text-cobalt-400" : "text-cobalt-500",
          )}
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            delay: reduceMotion ? 0 : 0.15 + index * 0.05,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <Plus strokeWidth={4} className="size-6" />
        </motion.span>
      ))}
    </>
  );
}

/**
 * The decorative layer behind a dark section: the hero's ruled grid plus a
 * single cobalt glow, both faded out before they reach the section edge.
 */
export function DarkBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <div className="absolute inset-0 grid-lines mask-radial-fade" />
      <div className="absolute left-1/2 top-0 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt-600/20 blur-[120px]" />
    </div>
  );
}

/** The same treatment for light sections. */
export function LightBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <div className="absolute inset-0 grid-lines-ink mask-radial-fade" />
    </div>
  );
}

/** The hero's "Available now" pulse, reused for status tags. */
export function StatusDot({ tone = "live" }: { tone?: "live" | "pending" }) {
  if (tone === "pending") {
    return (
      <span aria-hidden="true" className="relative flex size-3 items-center justify-center">
        <span className="relative inline-flex size-2 rounded-full bg-ink-500" />
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="relative flex size-3 items-center justify-center">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-green-500" />
    </span>
  );
}
