"use client"

import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useReducedMotionPreference } from "@/components/ui/use-reduced-motion-preference"
import { LINKS } from "@/lib/links"

const HERO_COPY =
  "Oraami analyzes your website, understands your product and audience, and surfaces the leads that match your ideal customer profile — automatically."

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] as const },
  },
}

export default function Hero() {
  const reduceMotion = useReducedMotionPreference()

  return (
    <section id="hero" className="relative w-full bg-white px-3 sm:px-4 lg:px-5">
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={containerVariants}
        className="relative w-full overflow-hidden rounded-[20px] bg-heading text-white"
      >
        <div className="landing-container pt-12 sm:pt-14 lg:pt-20">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-brand/10 px-4 py-1.5 text-[13px] font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#ff8904]" aria-hidden="true" />
              AI-Powered Lead Intelligence Platform
            </span>
          </motion.div>

          <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)] lg:items-start lg:gap-12">
            <motion.div variants={itemVariants} className="min-w-0 max-w-[705px]">
              <h1 className="max-w-[700px] text-balance text-[clamp(2.1rem,7.8vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-[#eef2ff]">
                <span className="block">
                  Identify Customers <span className="text-brand-deep">Most</span>
                </span>
                <span className="block">
                  <span className="text-brand-deep">Likely</span> to Convert
                </span>
              </h1>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  href={LINKS.login}
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  className="w-full px-5 transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:h-10 sm:w-auto sm:min-w-[180px]"
                >
                  Get Started
                </Button>
                <Button
                  href="/features"
                  variant="outline"
                  size="md"
                  icon={ArrowRight}
                  className="w-full border-brand bg-transparent px-5 text-white transition-transform hover:-translate-y-0.5 hover:bg-white/[0.04] hover:text-white active:translate-y-0 sm:h-10 sm:w-auto sm:min-w-[180px]"
                >
                  Explore Features
                </Button>
              </div>

              <p className="mt-5 max-w-[31rem] text-[15px] leading-[1.6] text-[#dadada] lg:hidden sm:text-[16px]">
                {HERO_COPY}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="hidden min-w-0 max-w-[540px] lg:mt-[5px] lg:block lg:justify-self-end">
              <p className="max-w-[487px] text-left text-[16px] leading-[1.6] text-[#dadada]">
                {HERO_COPY}
              </p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative mt-10 w-full sm:mt-12 lg:mt-20">
            <div className="relative w-full overflow-hidden rounded-t-[24px] bg-[#1e1e1e] p-2 pb-0 shadow-[0_0_10px_rgba(245,73,0,0.3),0_0_48px_rgba(245,73,0,0.3)] lg:rounded-t-[40px]">
              <div className="relative overflow-hidden rounded-t-[18px] lg:rounded-t-[32px]">
                <div className="relative flex h-12 items-center bg-ink px-5">
                  <span className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3" />
                    <span className="h-2 w-2 rounded-full bg-[#febc2e] sm:h-3 sm:w-3" />
                    <span className="h-2 w-2 rounded-full bg-[#28c840] sm:h-3 sm:w-3" />
                  </span>
                  <span className="absolute left-1/2 flex max-w-[calc(100%-96px)] -translate-x-1/2 items-center gap-2 truncate rounded-full bg-white/[0.07] px-4 py-1.5 text-[12px] text-white/70">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#28c840]" aria-hidden="true" />
                    <span className="truncate">app.oraami.com / icps</span>
                  </span>
                </div>
                <div className="relative w-full overflow-hidden [aspect-ratio:1240/552]">
                  <Image
                    src="/dashboard-preview.png"
                    alt="Oraami product dashboard preview"
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 1280px) calc(100vw - 2rem), 1240px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
