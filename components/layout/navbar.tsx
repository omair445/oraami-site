"use client"

import { useEffect, useState, type ComponentProps } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Menu, X } from "lucide-react"
import { useReducedMotionPreference } from "@/components/ui/use-reduced-motion-preference"

function NavLink({ href, children, ...rest }: ComponentProps<"a">) {
  if (href && href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href ?? "#"} {...rest}>
      {children}
    </Link>
  )
}

const PRIMARY_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/why-oraami", label: "Why Oraami" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  return <NavbarShell pathname={pathname} />
}

function NavbarShell({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)
  const reduceMotion = useReducedMotionPreference()
  const onHome = pathname === "/"

  const to = (href: string) => (href.startsWith("#") ? (onHome ? href : "/" + href) : href)

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 16)

    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })
    return () => window.removeEventListener("scroll", updateHeader)
  }, [])

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)")
    const closeMenuAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }

    desktopQuery.addEventListener("change", closeMenuAtDesktop)
    return () => desktopQuery.removeEventListener("change", closeMenuAtDesktop)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] w-full bg-white text-ink transition-shadow ${
        reduceMotion ? "duration-0" : "duration-300"
      } ${scrolled && !open ? "shadow-[0_6px_20px_-18px_rgba(30,26,77,0.22)]" : ""}`}
    >
      <div className="viewport-landing-container">
        <div className="relative flex h-[72px] w-full items-center justify-between lg:h-[100px]">
          <NavLink
            href={onHome ? "#hero" : "/"}
            aria-label="Oraami home"
            className="relative block h-[38px] w-[99px] shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <Image
              src="/icon1.svg"
              alt="Oraami"
              width={99}
              height={38}
              priority
              className="h-[38px] w-[99px] object-contain"
            />
          </NavLink>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-[34px] lg:flex"
            aria-label="Primary"
          >
            {PRIMARY_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={to(link.href)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`text-[16px] font-medium transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                  pathname === link.href ? "text-brand" : "text-ink"
                }`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4">
            <NavLink
              href="/contact"
              className="hidden h-10 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:inline-flex"
            >
              Book a Call
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </NavLink>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="nav-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-black/10 bg-white text-ink transition-colors hover:border-black/20 hover:bg-canvas-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:hidden"
            >
              {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                id="nav-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.2, 0.8, 0.2, 1] as const }}
                className="fixed inset-x-0 bottom-0 top-[72px] z-[101] overflow-y-auto bg-heading text-white lg:hidden"
              >
                <div className="viewport-landing-container flex min-h-full flex-col pb-5 pt-5 sm:pb-7 sm:pt-8">
                  <nav aria-label="Primary mobile">
                    {PRIMARY_LINKS.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : index * 0.035 }}
                        className="border-b border-white/10"
                      >
                        <NavLink
                          href={to(link.href)}
                          onClick={() => setOpen(false)}
                          aria-current={pathname === link.href ? "page" : undefined}
                          className={`group flex items-center justify-between py-[clamp(1rem,3vh,1.5rem)] text-[clamp(1.65rem,5vw,2rem)] font-medium leading-none tracking-[-0.02em] transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                            pathname === link.href ? "text-brand" : "text-white"
                          }`}
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-5 w-5 text-white/45 transition-transform group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true" />
                        </NavLink>
                      </motion.div>
                    ))}
                  </nav>

                  <div className="mt-auto pt-8">
                    <p className="mb-4 max-w-sm text-[14px] leading-6 text-white/55">
                      Find better-fit accounts, build stronger outreach, and book more qualified meetings.
                    </p>
                    <NavLink
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 sm:max-w-[280px]"
                    >
                      Book a Call
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </NavLink>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
