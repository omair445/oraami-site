"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { AnimatePresence, motion, useAnimationControls, useInView, type Variants } from "framer-motion"
import {
  ArrowRight,
  Mail,
  Network,
  Search,
  Target,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useReducedMotionPreference } from "@/components/ui/use-reduced-motion-preference"
import { FEATURE_VISUALS } from "@/components/visuals/features"
import type { FeatureVisualId } from "@/components/visuals/types"

type Feature = {
  id: FeatureVisualId
  Icon: LucideIcon
  title: string
  desc: string
  metric: string
  metricLabel: string
}

const FEATURES: Feature[] = [
  {
    id: "icp",
    Icon: Target,
    title: "ICP Research & Targeting",
    desc:
      "Every ICP is capped at a tightly curated set of high-fit leads, so your team works a laser-focused list built around the accounts most likely to convert faster.",
    metric: "50",
    metricLabel: "accounts per ICP",
  },
  {
    id: "research",
    Icon: Search,
    title: "Deep Lead Research",
    desc: "Several minutes of autonomous AI research happens on every prospect before your team ever reaches out with context.",
    metric: "5-10",
    metricLabel: "minutes per lead",
  },
  {
    id: "stakeholders",
    Icon: Network,
    title: "Multi-Stakeholder Mapping",
    desc: "Map several decision-makers across each account, not just a single point of contact or surface-level champion.",
    metric: "6-10",
    metricLabel: "people per account",
  },
  {
    id: "sequences",
    Icon: Mail,
    title: "Trust-Building Sequences",
    desc: "A carefully timed sequence of personalised emails over an extended window builds genuine relationships and stronger trust.",
    metric: "6-12",
    metricLabel: "week window",
  },
]

const ease = [0.22, 1, 0.36, 1] as const
const FEATURE_AUTOPLAY_SECONDS = 7
const FEATURE_AUTOPLAY_MS = FEATURE_AUTOPLAY_SECONDS * 1000

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
}

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
}

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease,
      when: "beforeChildren",
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.24,
      ease,
    },
  },
}

const detailVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease },
  },
}

function FeatureVisual({ feature, reduce }: { feature: Feature; reduce: boolean }) {
  const visualRef = useRef<HTMLDivElement>(null)
  const inView = useInView(visualRef, { margin: "0px 0px -12% 0px" })
  const Visual = FEATURE_VISUALS[feature.id]
  return (
    <div ref={visualRef}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={feature.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduce ? 0 : 0.32, ease }}>
          <Visual play={inView} reduceMotion={reduce} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function AutoplayProgress({ paused }: { paused: boolean }) {
  const controls = useAnimationControls()

  useEffect(() => {
    if (paused) {
      controls.stop()
      return
    }

    controls.set({ scaleX: 0 })
    void controls.start({
      scaleX: 1,
      transition: { duration: FEATURE_AUTOPLAY_SECONDS, ease: "linear" },
    })

    return () => controls.stop()
  }, [controls, paused])

  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 origin-left rounded-full bg-brand"
      initial={{ scaleX: 0 }}
      animate={controls}
    />
  )
}

function FeatureTab({
  feature,
  index,
  active,
  onSelect,
  reduce,
  autoplayPaused,
  autoplayCycle,
  registerTabRef,
}: {
  feature: Feature
  index: number
  active: boolean
  onSelect: (index: number) => void
  reduce: boolean
  autoplayPaused: boolean
  autoplayCycle: number
  registerTabRef: (index: number, node: HTMLButtonElement | null) => void
}) {
  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`feature-panel-${feature.id}`}
      id={`feature-tab-${feature.id}`}
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(index)}
      ref={(node) => {
        registerTabRef(index, node)
      }}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      className={`group relative flex h-[88px] w-full flex-col justify-between overflow-hidden rounded-xl border px-3 py-3 text-left transition-[transform,box-shadow,border-color,background-color] duration-200 sm:h-[94px] sm:px-3.5 lg:h-[98px] ${
        active ? "border-brand" : "border-transparent"
      }`}
      animate={{}}
      style={{ backgroundColor: active ? "rgba(245,73,0,0.08)" : "#F2F2F2" }}
    >
      {active ? (
        <motion.span
          layoutId="features-active-tab"
          className="absolute inset-0 rounded-2xl bg-brand/[0.04]"
          transition={{ duration: reduce ? 0 : 0.42, ease }}
        />
      ) : null}

      <span className="relative z-10 flex h-full min-w-0 flex-col items-start justify-center gap-2.5 sm:gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-brand shadow-[0_10px_22px_-20px_rgba(32,21,21,0.42)] sm:h-10 sm:w-10 ${
            active ? "border-brand/20 bg-brand text-on-primary" : "border-black/10 bg-white"
          }`}
        >
          <feature.Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span
          className={`block text-[12px] font-medium leading-[1.3] sm:text-[13px] ${active ? "text-heading" : "text-ink"}`}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {feature.title}
        </span>
      </span>

      <motion.span
        aria-hidden="true"
        className={`absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full ${active ? "bg-brand/10" : "bg-transparent"}`}
        layoutId="features-active-underline"
        transition={{ duration: reduce ? 0 : 0.32, ease }}
      >
        {active ? (
          reduce ? (
            <span className="absolute inset-0 bg-brand" />
          ) : (
            <AutoplayProgress key={autoplayCycle} paused={autoplayPaused} />
          )
        ) : null}
      </motion.span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-2xl border transition-opacity duration-200 ${
          active ? "border-white/5 opacity-100" : "border-black/5 opacity-0 group-hover:opacity-100"
        }`}
      />
    </motion.button>
  )
}

function FeatureDetails({ feature, reduce }: { feature: Feature; reduce: boolean }) {
  return (
    <motion.div
      key={feature.id}
      role="tabpanel"
      id={`feature-panel-${feature.id}`}
      aria-labelledby={`feature-tab-${feature.id}`}
      className="grid gap-6 md:h-full md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] md:items-center md:gap-7 lg:gap-8"
      variants={reduce ? undefined : panelVariants}
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "visible"}
      exit={reduce ? undefined : "exit"}
    >
      <motion.div
        className="flex h-full flex-col justify-center py-2 md:py-0"
        variants={reduce ? undefined : detailVariants}
      >
        <div className="space-y-4">
          <h3 className="landing-card-title max-w-[22ch] text-[clamp(1.5rem,2.4vw,1.8rem)]">
            {feature.title}
          </h3>
          <p className="landing-section-description max-w-[28rem]">{feature.desc}</p>
        </div>
      </motion.div>

      <motion.div
        className="md:pt-1"
        variants={reduce ? undefined : detailVariants}
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.48, delay: 0.08, ease }}
      >
        <FeatureVisual feature={feature} reduce={reduce} />
      </motion.div>
    </motion.div>
  )
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const tabListRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionPreference()
  const entered = useInView(sectionRef, { once: true, amount: 0.18 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const [autoplayCycle, setAutoplayCycle] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeFeature = FEATURES[activeIndex]

  const registerTabRef = (index: number, node: HTMLButtonElement | null) => {
    tabRefs.current[index] = node
  }

  const handleSelect = (nextIndex: number, options?: { focusTab?: boolean }) => {
    setActiveIndex(nextIndex)
    setAutoplayCycle((cycle) => cycle + 1)

    if (options?.focusTab) {
      tabRefs.current[nextIndex]?.focus({ preventScroll: true })
    }
  }

  const handleAutoplayResume = () => {
    setAutoplayPaused(false)
    setAutoplayCycle((cycle) => cycle + 1)
  }

  useEffect(() => {
    if (reduce || autoplayPaused || !entered) return

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % FEATURES.length)
      setAutoplayCycle((cycle) => cycle + 1)
    }, FEATURE_AUTOPLAY_MS)

    return () => window.clearTimeout(timer)
  }, [autoplayCycle, autoplayPaused, entered, reduce])

  useEffect(() => {
    const tabList = tabListRef.current
    const activeTab = tabRefs.current[activeIndex]

    if (!tabList || !activeTab) return

    const tabLeft = activeTab.offsetLeft
    const tabRight = tabLeft + activeTab.offsetWidth
    const visibleLeft = tabList.scrollLeft
    const visibleRight = visibleLeft + tabList.clientWidth

    if (tabLeft >= visibleLeft && tabRight <= visibleRight) return

    const nextLeft = tabLeft - (tabList.clientWidth - activeTab.offsetWidth) / 2
    tabList.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: reduce ? "auto" : "smooth",
    })
  }, [activeIndex, reduce])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = FEATURES.length - 1
    let nextIndex = activeIndex

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1
        break
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1
        break
      case "Home":
        nextIndex = 0
        break
      case "End":
        nextIndex = lastIndex
        break
      default:
        return
    }

    event.preventDefault()
    handleSelect(nextIndex, { focusTab: true })
  }

  return (
    <section ref={sectionRef} id="features" className="relative w-full overflow-hidden bg-[#FFFFFF] text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(245,73,0,0.04),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,73,0,0.03),transparent_28%)]"
      />

      <div className="landing-container relative py-12 sm:py-14 lg:py-16">
        <motion.div
          initial={reduce ? false : "hidden"}
          animate={entered ? "visible" : "hidden"}
          variants={listVariants}
          className="max-w-2xl"
        >
          
          <motion.h2 variants={fadeUp} className="landing-section-title">
            What Oraami automates
          </motion.h2>
          <motion.p variants={fadeUp} className="landing-section-description mt-4 max-w-xl">
            From ICP definition to trust-building sequences, the full quality-first BDR motion is handled end to end.
          </motion.p>
        </motion.div>

        <motion.div
          role="tablist"
          aria-label="Oraami features"
          initial={false}
          animate={entered ? "visible" : "hidden"}
          variants={listVariants}
          className="relative mt-6 rounded-[16px] border border-black/5 bg-white p-2.5 sm:p-3"
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setAutoplayPaused(true)}
          onMouseLeave={handleAutoplayResume}
        >
          <div ref={tabListRef} className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <motion.div key={feature.id} variants={fadeUp} className="min-w-0">
                <FeatureTab
                  feature={feature}
                  index={index}
                  active={index === activeIndex}
                  onSelect={handleSelect}
                  reduce={reduce}
                  autoplayPaused={autoplayPaused || !entered}
                  autoplayCycle={autoplayCycle}
                  registerTabRef={registerTabRef}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 h-auto rounded-[20px] border border-black/[0.04] bg-white p-4 shadow-[0_14px_38px_-34px_rgba(32,21,21,0.32)] sm:rounded-[24px] sm:p-5 md:h-[380px] lg:h-[407px] lg:p-10"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={entered ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: reduce ? 0 : 0.55, ease }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <FeatureDetails key={activeFeature.id} feature={activeFeature} reduce={reduce} />
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={entered ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: reduce ? 0 : 0.48, delay: 0.18, ease }}
          className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6"
        >
          <p className="text-[15px] leading-relaxed text-muted">
            Multi-tenant security and more, built into the same quality-first motion.
          </p>
          <Button href="/features" variant="outline" size="md" icon={ArrowRight} className="w-full shrink-0 border-brand bg-white text-ink hover:border-brand-hover hover:bg-white sm:w-auto">
            Explore all Features
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
