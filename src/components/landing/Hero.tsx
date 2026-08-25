import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { renderCanvas } from "@/components/ui/canvas";
import { Button } from "@/components/ui/Button";
import { relativeTime } from "@/utils/formatting";

export interface HeroProps {
  /** Set when a plan already exists in this browser. */
  saved: { name: string; updatedAt: string } | null;
  /** Continue the saved plan, or start a fresh one when nothing is saved. */
  onStart: () => void;
  /** Discard the saved plan and begin again - only rendered when `saved` is set. */
  onRestart: () => void;
}

const CORNERS = [
  "-left-5 -top-5",
  "-bottom-5 -left-5",
  "-right-5 -top-5",
  "-bottom-5 -right-5",
];

export function Hero({ saved, onStart, onRestart }: HeroProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => renderCanvas("hero-canvas"), []);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 28 },
    },
  };

  return (
    <section id="home" className="relative isolate -mt-16 overflow-hidden bg-ink-950">
      <canvas
        id="hero-canvas"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-32 text-center sm:px-8 sm:pb-28 sm:pt-40"
      >
        

        {/* Framed headline */}
        <motion.div variants={item} className="mt-8 w-full px-2 sm:mt-10">
          <div className="relative mx-auto h-full max-w-5xl border border-white/15 p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-16">
            {CORNERS.map((position) => (
              <motion.span
                key={position}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute ${position} text-cobalt-400`}
                aria-hidden="true"
              >
                <Plus strokeWidth={4} className="size-10" />
              </motion.span>
            ))}

            <h1 className="select-none text-balance px-3 py-2 text-center text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              Build the blueprint for your{" "}
              <span className="font-display font-normal italic text-cobalt-300">perfect</span>{" "}
              business website.
            </h1>

            <div className="mt-6 flex items-center justify-center gap-1.5">
              <span className="relative flex size-3 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              <p className="text-xs font-medium text-green-400">Available now</p>
            </div>
          </div>
        </motion.div>

        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-2xl text-pretty px-2 text-[17px] leading-relaxed text-ink-300 sm:text-[19px]"
        >
          Tell us about your business and we'll turn your answers into a complete website strategy,
          page structure, design direction, and AI-ready website blueprint.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" onClick={onStart} className="bg-white text-ink-950 hover:bg-ink-100">
              {saved ? "Continue your website plan" : "Create my website plan"}
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {saved ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={onRestart}
                className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Start new
              </Button>
            ) : (
              <a
                href="#how-it-works"
                className="inline-flex h-13 select-none items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-150 hover:border-white/30 hover:bg-white/10"
              >
                See how it works
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.p variants={item} className="mt-4 text-[13px] text-ink-400">
          {saved ? (
            <>
              Saved plan for <span className="font-medium text-ink-200">{saved.name}</span> · updated{" "}
              {relativeTime(saved.updatedAt)}
            </>
          ) : (
            <>Free, no account needed. Your answers stay in your browser.</>
          )}
        </motion.p>
      </motion.div>
    </section>
  );
}
