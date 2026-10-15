import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useParallax } from "@/components/useParallax";
// PLACEHOLDER wordmarks — drop the official logo files in at these same paths to swap them site-wide.
import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";
// Official logo (monogram + wordmark), used in the hero.
import logoFull from "@/assets/logo-full.png";
import aboutImg from "@/assets/about.jpg";
import firmImg from "@/assets/firm.jpg";

const NAV = [
  { label: "HOME", id: "home" },
  { label: "ABOUT", id: "about" },
  { label: "WHAT WE DO", id: "what-we-do" },
  { label: "WHO WE WORK WITH", id: "who-we-work-with" },
  { label: "THE FIRM", id: "the-firm" },
  { label: "CONTACT", id: "contact" },
];

const SERVICES = [
  {
    title: "Strategic Advisory",
    body: ["Advising businesses, entrepreneurs and investors on growth, expansion, partnerships, transactions and long-term strategy."],
  },
  {
    title: "Business Development",
    body: ["Identifying new business opportunities, securing strategic partnerships, supporting market expansion and generating new commercial relationships."],
  },
  {
    title: "Representation",
    body: ["Representing businesses, brands, public figures and projects in business negotiations, partnerships, licensing opportunities and commercial transactions."],
  },
  {
    title: "Capital & Investments",
    body: [
      "Identifying investors for businesses seeking capital and sourcing investment opportunities for private investors, family offices and strategic partners.",
      "We also selectively invest in businesses and projects through equity participation, joint ventures and long-term ownership alongside founders and investment partners.",
    ],
  },
  {
    title: "Workforce Solutions",
    body: ["Supporting contractors and businesses through workforce sourcing and recruitment partnerships."],
  },
];

const CLIENTS = [
  "Entrepreneurs",
  "Businesses",
  "Investors",
  "Family Offices",
  "Developers",
  "Hospitality Groups",
  "Consumer Brands",
  "Public Figures",
  "Institutions",
];

/* Shared editorial grid: every section hangs its content from column 6 of the same 12-column grid. */
const CONTAINER = "mx-auto w-full max-w-[1440px] px-6 md:px-12";
const GRID = "grid gap-y-8 lg:grid-cols-12 lg:gap-x-16";
const RAIL = "lg:col-span-4";
const CONTENT = "lg:col-span-7 lg:col-start-6";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Single burgundy bar that glides between links as the active section changes.
  useLayoutEffect(() => {
    const measure = () => {
      const link = linkRefs.current.get(active);
      const nav = navRef.current;
      if (!link || !nav) return;
      setBar({ x: link.offsetLeft, w: link.offsetWidth });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // Close the mobile menu on Escape and lock scroll beneath it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`header-in fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-[var(--dur)] ease-[var(--ease)] ${
        solid
          ? "border-b border-hairline bg-parchment/90 py-4 backdrop-blur-md"
          : "border-b border-transparent py-6 md:py-8"
      }`}
    >
      <div className={`${CONTAINER} flex items-center justify-between gap-6`}>
        <a href="#home" className="block shrink-0" aria-label="Vaelis — home">
          <img
            src={logoDark}
            alt="Vaelis"
            width={600}
            height={100}
            className={`w-auto origin-left transition-transform duration-[var(--dur)] ease-[var(--ease)] md:h-4 ${
              solid ? "h-3.5 md:scale-[0.88]" : "h-3.5"
            }`}
          />
        </a>

        <nav ref={navRef} className="relative hidden lg:flex lg:justify-end lg:gap-10">
          {NAV.map((n) => (
            <a
              key={n.id}
              ref={(el) => {
                if (el) linkRefs.current.set(n.id, el);
                else linkRefs.current.delete(n.id);
              }}
              href={`#${n.id}`}
              aria-current={active === n.id ? "location" : undefined}
              className={`label-sm link-underline whitespace-nowrap transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] hover:text-ink ${
                active === n.id ? "text-ink" : "text-ink/60"
              }`}
            >
              {n.label}
            </a>
          ))}
          <span
            aria-hidden="true"
            className="absolute bottom-[-0.4rem] left-0 h-px w-px origin-left bg-burgundy transition-[transform,opacity] duration-[var(--dur)] ease-[var(--ease)]"
            style={{
              opacity: bar ? 1 : 0,
              transform: bar ? `translateX(${bar.x}px) scaleX(${bar.w})` : undefined,
            }}
          />
        </nav>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 py-1 text-ink lg:hidden"
        >
          <span className="label-sm">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      <nav
        id="mobile-menu"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        className="menu-panel absolute inset-x-0 top-full border-b border-t border-hairline bg-parchment px-6 py-8 lg:hidden"
      >
        <ul className="flex flex-col items-end gap-5 text-right">
          {NAV.map((n, i) => (
            <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
              <a
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                className={`label-sm transition-colors duration-[var(--dur-fast)] ${active === n.id ? "text-burgundy" : "text-ink/80"}`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/* Image that wipes open on entry and drifts very slightly with scroll. Fills its parent box. */
function DriftImage({
  src,
  alt,
  width,
  height,
  position = "50% 50%",
  strength = 0.05,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  strength?: number;
  className?: string;
}) {
  const drift = useParallax<HTMLDivElement>(strength);
  return (
    <Reveal variant="wipe" className={`relative overflow-hidden ${className}`}>
      <div ref={drift} className="parallax-bleed">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    </Reveal>
  );
}

/* Left padding that lines the half-width Firm column up with the site container. */
const ALIGN_LEFT = "px-6 md:px-12 lg:pl-[max(3rem,calc((100vw-1440px)/2+3rem))] lg:pr-20";

export default function Index() {
  return (
    <div className="bg-parchment text-ink">
      <Nav />

      <main>
        {/* HERO */}
        <section id="home" className="relative flex min-h-svh items-center justify-center overflow-hidden">
          <div className="relative mx-auto w-full max-w-4xl px-6 py-32 text-center">
            <h1 className="hero-in flex justify-center" style={{ "--i": 0 } as React.CSSProperties}>
              {/* The PNG has an opaque white ground; multiply lets the parchment show through. */}
              <img
                src={logoFull}
                alt="Vaelis"
                width={1456}
                height={820}
                fetchPriority="high"
                className="w-[min(72vw,22rem)] mix-blend-multiply md:w-[26rem]"
              />
            </h1>
            <div
              className="hero-in-line mx-auto mt-10 h-px w-16 bg-ink/20 md:mt-12"
              style={{ "--i": 2 } as React.CSSProperties}
            />
            {/* Two centred lines on mobile; bullets are glued to their neighbours so none can orphan at a line edge. */}
            <p
              className="hero-in mx-auto mt-10 max-w-2xl font-serif text-[1.0625rem] font-light leading-[1.7] text-ink/70 sm:text-xl md:mt-12 md:text-2xl"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              Strategic&nbsp;Advisory&nbsp;•&nbsp;Business&nbsp;Development
              <span className="hidden sm:inline">&nbsp;•&nbsp;</span>
              <br className="sm:hidden" />
              Representation&nbsp;•&nbsp;Investments
            </p>
          </div>

          {/* Scroll cue: a hairline with a slow falling highlight. Decorative only. */}
          <div aria-hidden="true" className="hero-in absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-12" style={{ "--i": 5 } as React.CSSProperties}>
            <span className="scroll-cue block h-14 w-px bg-ink/15 md:h-16" />
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-parchment pb-24 pt-20 md:pb-36 md:pt-28">
          <div className={CONTAINER}>
            <Reveal>
              <p className="section-title text-burgundy">About</p>
            </Reveal>
            <Reveal variant="clip" className="mt-8 md:mt-10">
              <h2 className="max-w-5xl font-serif text-[2.25rem] leading-[1.12] sm:text-5xl lg:text-[4rem] lg:leading-[1.08]">
                Vaelis is a private firm focused on identifying, developing and executing
                business opportunities.
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-y-12 md:mt-20 lg:mt-24 lg:grid-cols-12 lg:gap-x-16">
              <DriftImage
                src={aboutImg}
                alt="Private office with oak panelling, a burgundy lacquered desk and a sculptural pendant light"
                width={1200}
                height={1440}
                position="50% 50%"
                className="aspect-[4/5] lg:col-span-6"
              />

              <div className="text-base leading-[2] text-ink/75 md:text-[1.0625rem] lg:col-span-5 lg:col-start-8 lg:self-center">
                <Reveal delay={120} className="space-y-6 md:space-y-7">
                  <p>
                    We advise, represent and invest alongside businesses, entrepreneurs,
                    investors and institutions across a range of industries.
                  </p>
                  <p>
                    Our work spans strategic advisory, business development, representation and
                    investments. We support clients seeking growth, capital, partnerships and
                    market expansion, while also investing alongside businesses where we
                    believe we can contribute long-term value.
                  </p>
                </Reveal>
                <Reveal variant="line" delay={200} className="my-10 w-12 md:my-12">
                  <div className="h-px w-full bg-burgundy/60" />
                </Reveal>
                <Reveal delay={240} className="space-y-6 md:space-y-7">
                  <p>
                    Vaelis was established to build businesses, create opportunities and
                    participate in ventures with long-term potential.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Pull quote: the section's closing line, given its own centred moment. */}
            <div className="mx-auto mt-20 max-w-4xl text-center md:mt-32">
              <Reveal variant="line" className="mx-auto w-12 origin-center">
                <div className="h-px w-full bg-burgundy/60" />
              </Reveal>
              <Reveal variant="clip" delay={120} className="mt-10 md:mt-12">
                <p className="font-serif text-[1.75rem] font-light leading-[1.3] text-ink md:text-[2.5rem]">
                  Every engagement is approached with a clear objective and managed directly by a
                  partner.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section id="what-we-do" className="bg-beige py-20 md:py-32">
          <div className={CONTAINER}>
            <Reveal>
              <p className="section-title text-burgundy">What We Do</p>
            </Reveal>
            <Reveal variant="line" delay={100} className="mt-6 md:mt-8">
              <div className="h-px w-full bg-ink/15" />
            </Reveal>

            {/* A quiet table: each row separated by a hairline that draws in as it enters. */}
            <div>
              {SERVICES.map((s, i) => (
                <div key={s.title}>
                  {i > 0 && (
                    <Reveal variant="line">
                      <div className="h-px w-full bg-ink/10" />
                    </Reveal>
                  )}
                  <Reveal as="article" delay={80} className={`${GRID} group gap-y-4 py-9 md:py-12`}>
                    <h3 className="font-serif text-3xl leading-tight transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease)] group-hover:translate-x-2 group-hover:text-burgundy md:text-[2.5rem] lg:col-span-5">
                      {s.title}
                    </h3>
                    <div className={`${CONTENT} max-w-2xl space-y-5 text-base leading-[2] text-ink/75 md:space-y-6 lg:pt-1.5`}>
                      {s.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO WE WORK WITH */}
        <section id="who-we-work-with" className="bg-parchment py-20 md:py-32">
          <div className={CONTAINER}>
            <div className={GRID}>
              <div className={RAIL}>
                <Reveal className="lg:pt-3">
                  <p className="section-title text-burgundy">Who We Work With</p>
                </Reveal>
              </div>
              {/* Curated list: two columns from `sm`, a compact single column below. Markers only, no dividers. */}
              <ul className={`${CONTENT} sm:columns-2 sm:gap-x-16`}>
                {CLIENTS.map((c, i) => (
                  <Reveal as="li" key={c} delay={i * 70} className="break-inside-avoid py-2 sm:py-3">
                    <span className="group flex items-baseline gap-5 font-serif text-2xl font-light leading-snug tracking-wide md:text-[1.75rem]">
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 translate-y-[-0.25em] rounded-full bg-burgundy transition-transform duration-[var(--dur-fast)] ease-[var(--ease)] group-hover:scale-150"
                      />
                      <span className="transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] group-hover:text-burgundy">
                        {c}
                      </span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* THE FIRM: split panel, statement on ink beside a full-height architectural image. */}
        <section id="the-firm" className="bg-ink text-parchment lg:grid lg:min-h-[48rem] lg:grid-cols-2">
          <div className={`${ALIGN_LEFT} flex flex-col justify-center py-20 md:py-32`}>
            <Reveal>
              <p className="section-title text-beige">The Firm</p>
            </Reveal>
            <Reveal variant="clip" className="mt-8 md:mt-10">
              <p className="max-w-xl font-serif text-3xl font-light leading-[1.3] md:text-[2.5rem]">
                Vaelis is led by a small team of partners with experience across
                entrepreneurship, investment, business development and strategic relationships.
              </p>
            </Reveal>
            <Reveal variant="line" delay={250} className="mt-10 w-12 md:mt-12">
              <div className="h-px w-full bg-beige/50" />
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-10 max-w-md text-base leading-[2] text-parchment/70 md:mt-12 md:text-[1.0625rem]">
                Every engagement is managed directly by a partner, ensuring continuity,
                discretion and accountability throughout each mandate.
              </p>
            </Reveal>
          </div>
          <DriftImage
            src={firmImg}
            alt="Warm wood-panelled workspace with softly lit desks"
            width={960}
            height={1200}
            position="50% 40%"
            strength={0.06}
            className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full"
          />
        </section>

        {/* CONTACT: the page closes on a single burgundy field. */}
        <section id="contact" className="bg-burgundy py-24 text-parchment md:py-40">
          <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
            <Reveal>
              <p className="section-title text-beige">Contact</p>
            </Reveal>
            <Reveal variant="clip" delay={100} className="mt-8 md:mt-10">
              <p className="font-serif text-3xl font-light leading-[1.3] md:text-[2.75rem]">
                For business enquiries, investment opportunities or partnership discussions, please
                contact the Vaelis team.
              </p>
            </Reveal>
            <Reveal delay={250}>
              <a
                href="mailto:office@vaelis.ae"
                className="eyebrow mt-12 inline-block border border-parchment/40 px-12 py-5 text-parchment transition-[background-color,border-color,color] duration-[var(--dur-fast)] ease-[var(--ease)] hover:border-parchment hover:bg-parchment hover:text-burgundy focus-visible:outline-parchment md:mt-14"
              >
                Contact Us
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-ink py-10 text-parchment md:py-12">
        <div className={`${CONTAINER} flex flex-col gap-5 md:flex-row md:items-center md:justify-between`}>
          <img src={logoLight} alt="Vaelis" width={600} height={100} className="h-3 w-auto self-start opacity-80 md:self-auto" />
          <span className="label-sm text-parchment/40">Based in the United Arab Emirates.</span>
        </div>
      </footer>
    </div>
  );
}
