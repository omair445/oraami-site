"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import {
  motion,
  type MotionValue,
  useInView,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion"

import { Button } from "@/components/ui/button"
import { useReducedMotionPreference } from "@/components/ui/use-reduced-motion-preference"
import { INDUSTRY_VISUALS } from "@/components/visuals/industries"
import type { IndustryVisualId } from "@/components/visuals/types"

type Feature = { title: string; description: string }
type Industry = { name: string; visualId: IndustryVisualId; description: string; items: Feature[] }

const INDUSTRIES: Industry[] = [
  {
    name: "SaaS",
    visualId: "saas",
    description:
      "Help SaaS teams identify the right accounts faster, sharpen outreach around product fit, and move qualified pipeline with stronger buying signals.",
    items: [
      { title: "ICP definition", description: "Define the ideal customer profile using firmographic and behavioral signals." },
      { title: "Lead scoring", description: "Prioritize high-intent accounts with clearer qualification and routing." },
      { title: "Trust sequences", description: "Send paced, relevant outreach that supports long sales cycles." },
      { title: "Meeting booking", description: "Convert qualified interest into booked conversations with less friction." },
    ],
  },
  {
    name: "IT Services",
    visualId: "it-services",
    description:
      "Reach IT decision-makers with technical context, infrastructure pain-point detection, and qualification that reflects real delivery constraints.",
    items: [
      { title: "Lead qualification", description: "Qualify leads based on tech stack, initiative, and budget fit." },
      { title: "Deep research", description: "Uncover technical needs, pain points, and current constraints." },
      { title: "Personalised email", description: "Reference technical details that make the outreach feel informed." },
      { title: "Enrichment", description: "Enrich leads with verified data and useful technology insights." },
    ],
  },
  {
    name: "Financial Services",
    visualId: "financial-services",
    description:
      "Support regulated sales cycles with profile research, compliance-aware outreach, risk review, and cleaner handoffs between teams.",
    items: [
      { title: "Account research", description: "Research financial context, stack, and business triggers." },
      { title: "Compliant outreach", description: "Reach out with messages aligned to industry expectations." },
      { title: "Sequenced touches", description: "Use coordinated follow-up to maintain momentum without pressure." },
      { title: "Clean handoffs", description: "Move sales conversations forward with clear, structured context." },
    ],
  },
  {
    name: "Healthcare",
    visualId: "healthcare",
    description:
      "Coordinate outreach to healthcare organizations with the right decision-makers, compliance context, and patient-safe communication workflows.",
    items: [
      { title: "Org research", description: "Research care delivery models, service lines, and strategic priorities." },
      { title: "Decision mapping", description: "Identify administrators, department leads, and buying stakeholders." },
      { title: "Compliant messaging", description: "Keep communication structured for regulated healthcare environments." },
      { title: "Meeting follow-up", description: "Move from first contact to scheduled conversation with clear next steps." },
    ],
  },
]

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index < 3 ? index * 0.09 : 0.15 + (index - 3) * 0.09,
      ease,
    },
  }),
}

const industryCardClassName =
  "group relative flex min-h-[300px] w-full flex-col overflow-hidden rounded-[18px] border border-black/[0.05] bg-white shadow-[0_18px_48px_-42px_rgba(32,21,21,0.2)] transition-all duration-300 ease-out hover:shadow-[0_22px_54px_-44px_rgba(245,73,0,0.16)] md:min-h-[369px]"

type StackLayout = { stickyTop: string; endScale: number }

const STACK_LAYOUTS: Record<"mobile" | "tablet" | "desktop", StackLayout> = {
  mobile: { stickyTop: "5.25rem", endScale: 0.96 },
  tablet: { stickyTop: "5.75rem", endScale: 0.93 },
  desktop: { stickyTop: "7rem", endScale: 0.9 },
}

function useStackLayout() {
  const [layout, setLayout] = useState<StackLayout>(STACK_LAYOUTS.mobile)

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1280px)")
    const tabletMedia = window.matchMedia("(min-width: 960px)")

    const update = () => {
      setLayout(desktopMedia.matches ? STACK_LAYOUTS.desktop : tabletMedia.matches ? STACK_LAYOUTS.tablet : STACK_LAYOUTS.mobile)
    }

    update()
    desktopMedia.addEventListener("change", update)
    tabletMedia.addEventListener("change", update)

    return () => {
      desktopMedia.removeEventListener("change", update)
      tabletMedia.removeEventListener("change", update)
    }
  }, [])

  return layout
}

function IndustryCardBody({ industry, reduceMotion }: { industry: Industry; reduceMotion: boolean }) {
  const Visual = INDUSTRY_VISUALS[industry.visualId]

  return (
    <div className="grid h-full flex-1 md:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] md:items-stretch">
      <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6">
        <h3 className="landing-card-title">
          {industry.name}
        </h3>

        <p className="landing-card-description mt-3 max-w-[31rem]">
          {industry.description}
        </p>
      </div>

      <div className="min-h-[190px] min-w-0 w-full p-3 sm:p-4 md:min-h-0 md:p-5">
        <div className="h-full w-full overflow-hidden rounded-[16px]">
          <Visual reduceMotion={reduceMotion} />
        </div>
      </div>
    </div>
  )
}

function StackCard({
  index,
  total,
  stackProgress,
  stickyTop,
  endScale,
  children,
}: {
  index: number
  total: number
  stackProgress: MotionValue<number>
  stickyTop: string
  endScale: number
  children: ReactNode
}) {
  const reduceMotion = useReducedMotionPreference()
  const isLast = index === total - 1
  const transitionStart = (index + 0.08) / total
  const transitionEnd = (index + 1) / total
  const springConfig = { stiffness: 180, damping: 28, mass: 0.6 }
  const scale = useSpring(useTransform(stackProgress, [transitionStart, transitionEnd], [1, endScale]), springConfig)
  const coverOpacity = useSpring(useTransform(stackProgress, [transitionStart, transitionEnd], [0, 1]), springConfig)
  const brightness = useTransform(stackProgress, [transitionStart, transitionEnd], [1, 0.84])
  const blurPx = useTransform(stackProgress, [transitionStart, transitionEnd], [0, 0.8])
  const filter = useMotionTemplate`brightness(${brightness}) blur(${blurPx}px)`
  const motionStyle =
    reduceMotion || isLast
      ? { zIndex: index + 1, transformOrigin: "50% 0%", top: stickyTop }
      : {
          zIndex: index + 1,
          scale,
          filter,
          transformOrigin: "50% 0%",
          willChange: "transform",
          top: stickyTop,
        }

  return (
    <motion.div className="relative sticky will-change-transform" style={motionStyle}>
      {children}
      {!isLast && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[18px] bg-canvas-soft"
          style={{ opacity: coverOpacity }}
        />
      )}
    </motion.div>
  )
}

function StaticIndustryCard({ industry }: { industry: Industry }) {
  const reduceMotion = useReducedMotionPreference()

  return (
    <motion.div
      custom={0}
      initial="visible"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.27, ease }}
      className={industryCardClassName}
    >
      <IndustryCardBody industry={industry} reduceMotion={reduceMotion} />
    </motion.div>
  )
}

export default function Solutions() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotionPreference()
  const entered = useInView(sectionRef, { once: true, margin: "0px 0px -20% 0px" })
  const animationState = reduceMotion || entered ? "visible" : "hidden"
  const { scrollYProgress: stackProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  })
  const { stickyTop: stackTop, endScale: stackEndScale } = useStackLayout()

  return (
    <section ref={sectionRef} className="relative w-full overflow-clip bg-[#f6f6f6] text-ink">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_58%,rgba(245,73,0,0.025),transparent_42%)]" />

      <div className="landing-container relative py-12 sm:py-14 lg:py-16">
        <motion.div initial={reduceMotion ? false : "hidden"} animate={animationState} variants={fadeUp} className="max-w-2xl">
          <h2 className="landing-section-title">
            Solutions by industry
          </h2>
          <p className="landing-section-description mt-4 max-w-xl">
            Industry-specific prospecting plays for every B2B service team — tuned to how each market actually buys.
          </p>
        </motion.div>

        {reduceMotion ? (
          <div ref={trackRef} className="mt-8 space-y-3">
            {INDUSTRIES.map((industry) => (
              <StaticIndustryCard key={industry.name} industry={industry} />
            ))}
          </div>
        ) : (
          <div ref={trackRef} className="relative mt-8 flex w-full flex-col gap-3 pb-4">
            {INDUSTRIES.map((industry, index) => (
              <StackCard
                key={industry.name}
                index={index}
                total={INDUSTRIES.length}
                stackProgress={stackProgress}
                stickyTop={stackTop}
                endScale={stackEndScale}
              >
                <motion.div
                  custom={index}
                  initial={reduceMotion ? false : "hidden"}
                  animate={animationState}
                  variants={cardVariants}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  className={industryCardClassName}
                >
                  <div className="relative flex flex-1 flex-col">
                    <IndustryCardBody industry={industry} reduceMotion={reduceMotion} />
                  </div>
                </motion.div>
              </StackCard>
            ))}
          </div>
        )}

        <div className="relative mt-7 flex justify-end">
          <Button href="/contact" variant="outline" icon={ArrowRight} className="w-full shrink-0 sm:w-auto">
            Book a Call
          </Button>
        </div>
      </div>
    </section>
  )
}
