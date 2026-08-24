import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getAllPosts, getLatestPosts, formatDate } from "@/lib/blog/blog"
import { createMeta, SITE_URL } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { LINKS } from "@/lib/links"

const { metadata: metadataExport, jsonLd } = createMeta({
  title: "Blog",
  description: "Insights on quality-first prospecting — research, ICP targeting, and trust-building outreach from the Oraami team.",
  path: "/blog",
  breadcrumbs: [{ label: "Blog", href: "/blog" }],
})
export const metadata = metadataExport

const CATEGORIES = ["All posts", "Sales Strategy", "Product", "AI & Data", "Customer Stories", "Company"] as const
type Category = (typeof CATEGORIES)[number]

type MoreFromBlogVariant = "gradient" | "warm" | "navy"

type MoreFromBlogPost = {
  category: string
  date: string
  readingTime: string
  title: string
  excerpt: string
  variant: MoreFromBlogVariant
  image?: string
  imageAlt?: string
  href?: string
}

const SYNCED_CARD_VARIANTS: MoreFromBlogVariant[] = ["gradient", "warm", "navy", "gradient", "navy"]

const cardBackgroundByVariant: Record<MoreFromBlogVariant, string> = {
  gradient: "bg-gradient-to-br from-oraami-accent-secondary to-brand",
  warm: "bg-gradient-to-br from-brand-deep to-brand",
  navy: "bg-oraami-accent-secondary",
}

function CategoryPill({ label, isActive }: { label: Category; isActive: boolean }) {
  const href = label === "All posts" ? "/blog" : `/blog?category=${encodeURIComponent(label)}`

  return (
    <Link
      href={href}
      scroll={false}
      className={
        isActive
          ? "rounded-full bg-oraami-accent-secondary px-5 py-2.5 text-[14px] font-semibold text-white"
          : "rounded-full border border-black/10 bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-brand/30"
      }
    >
      {label}
    </Link>
  )
}

function MoreFromBlogCard({ post }: { post: MoreFromBlogPost }) {
  const Wrapper = post.href ? Link : "div"
  const wrapperProps = post.href ? { href: post.href } : {}

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-black/[0.06] bg-white shadow-[0_10px_30px_-24px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(15,23,42,0.3)]"
    >
      <div className={`relative aspect-[16/9] overflow-hidden ${post.image ? "bg-canvas-soft" : cardBackgroundByVariant[post.variant]}`}>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.imageAlt ?? post.title}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1.7px)",
              backgroundSize: "9px 9px",
            }}
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[12px] text-faint">
          {post.date} · {post.readingTime}
        </div>
        <h3 className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-heading">{post.title}</h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand">
          Read more
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Wrapper>
  )
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: categoryParam } = await searchParams
  const activeCategory: Category = CATEGORIES.find((category) => category === categoryParam) ?? "All posts"

  const posts = getAllPosts()

  const syncedMoreFromBlogPosts: MoreFromBlogPost[] = getLatestPosts(5).map((post, index) => ({
    category: post.category,
    date: formatDate(post.date),
    readingTime: post.readingTime.replace(/\s*read$/i, ""),
    title: post.title,
    excerpt: post.excerpt,
    variant: SYNCED_CARD_VARIANTS[index % SYNCED_CARD_VARIANTS.length],
    image: post.image,
    imageAlt: post.imageAlt,
    href: `/blog/${post.slug}`,
  }))

  const moreFromBlogPosts: MoreFromBlogPost[] = syncedMoreFromBlogPosts

  const filteredMoreFromBlogPosts =
    activeCategory === "All posts" ? moreFromBlogPosts : moreFromBlogPosts.filter((post) => post.category === activeCategory)

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/blog#postlist`,
    name: "Oraami Blog",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  }

  return (
    <main className="overflow-hidden bg-white text-ink">
      {jsonLd && <JsonLd schema={jsonLd} />}
      <JsonLd schema={itemListJsonLd} />

      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5">
        <div className="relative isolate min-h-[55svh] overflow-hidden rounded-[20px] bg-oraami-accent-secondary text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_45%,color-mix(in_srgb,var(--color-brand)_8%,transparent),transparent_36%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[18%] top-1/2 h-[80%] w-[48%] -translate-y-1/2 rounded-full bg-brand/[0.04] blur-[110px]"
          />

          <div className="landing-container relative flex min-h-[55svh] items-center py-10 sm:py-12 lg:py-14">
            <div className="mx-auto max-w-[880px] text-center">
              <h1 className="mx-auto max-w-[760px] text-balance text-[clamp(2.1rem,7.8vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-indigo-soft">
                Notes on Finding the Right <span className="text-brand-deep">Buyer</span>
              </h1>

              <p className="mx-auto mt-7 max-w-[650px] text-[17px] leading-[1.62] text-white/65 sm:text-[18px]">
                How we think about matching, outreach, and what actually gets a reply — from the team building Oraami.
              </p>

              <div className="mt-9 flex items-center justify-center">
                <Button
                  href={LINKS.login}
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  className="w-full px-5 transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-canvas">
        <div className="site-container py-20">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((label) => (
              <CategoryPill key={label} label={label} isActive={label === activeCategory} />
            ))}
          </div>

          <div className="mt-16">
            <h2 className="landing-section-title !font-bold">More from the blog</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredMoreFromBlogPosts.map((post) => (
                <MoreFromBlogCard key={post.title} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
