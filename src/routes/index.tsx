import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
// PLACEHOLDER wordmarks — drop the official logo files in at these same paths to swap them site-wide.
import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";
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

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const solid = scrolled || open;
  const dark = !solid;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-700 ${
        solid
          ? "border-b border-hairline bg-parchment/90 py-4 backdrop-blur-md"
          : "border-b border-transparent py-6 md:py-7"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 md:px-12">
        <a href="#home" className="block shrink-0">
          <img src={dark ? logoLight : logoDark} alt="Vaelis" width={600} height={100} className="h-3.5 w-auto md:h-4" />
        </a>

        <nav className="hidden lg:flex lg:justify-end lg:gap-10">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              data-active={active === n.id}
              className={`label-sm link-underline whitespace-nowrap transition-colors duration-700 ${
                dark ? "text-parchment/80 hover:text-parchment" : "text-ink/70 hover:text-ink"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`shrink-0 lg:hidden ${dark ? "text-parchment" : "text-ink"}`}
        >
          <span className="label-sm">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-hairline bg-parchment px-6 py-7 lg:hidden">
          <ul className="flex flex-col items-end gap-5 text-right">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={() => setOpen(false)} className="label-sm text-ink/80">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default function Index() {
  return (
    <div className="bg-parchment text-ink">
      <Nav />

      <main>
        {/* HERO */}
        <section id="home" className="hero-bg relative flex min-h-svh items-center justify-center overflow-hidden">
          <div className="relative mx-auto w-full max-w-4xl px-6 py-32 text-center">
            <Reveal>
              <h1 className="flex justify-center">
                <img
                  src={logoLight}
                  alt="Vaelis"
                  width={600}
                  height={100}
                  className="w-[min(70vw,34rem)]"
                />
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <div className="mx-auto mt-10 h-px w-16 bg-beige/50 md:mt-12" />
            </Reveal>
            <Reveal delay={300}>
              {/* Two centred lines on mobile; bullets are glued to their neighbours so none can orphan at a line edge. */}
              <p className="mx-auto mt-10 max-w-2xl font-serif text-[1.0625rem] font-light leading-[1.7] text-beige sm:text-xl md:mt-12 md:text-2xl">
                Strategic&nbsp;Advisory&nbsp;•&nbsp;Business&nbsp;Development
                <span className="hidden sm:inline">&nbsp;•&nbsp;</span>
                <br className="sm:hidden" />
                Representation&nbsp;•&nbsp;Investments
              </p>
            </Reveal>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-parchment py-20 md:py-32">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-24">
              <div className="lg:col-span-4">
                <Reveal>
                  <p className="section-title text-burgundy">About</p>
                  <h2 className="mt-6 font-serif text-4xl leading-[1.15] md:mt-8 md:text-5xl">
                    Vaelis is a private firm focused on identifying, developing and executing
                    business opportunities.
                  </h2>
                </Reveal>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <Reveal delay={120}>
                  <div className="rule-thin text-ink" />
                  <div className="mt-8 space-y-6 text-base leading-[2] text-ink/75 md:mt-10 md:space-y-8 md:text-[1.0625rem]">
                    <p>
                      We advise, represent and invest alongside businesses, entrepreneurs,
                      investors and institutions across a range of industries.
                    </p>
                    <p>
                      Our work spans strategic advisory, business development, representation and
                      investments. We support clients seeking growth, capital, partnerships, market
                      expansion and strategic opportunities, while also investing alongside
                      businesses where we believe we can contribute long-term value.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:items-end md:gap-14">
                    <img
                      src={aboutImg}
                      alt="Private library with dark wood shelving and leather-bound volumes"
                      width={1200}
                      height={1504}
                      loading="lazy"
                      className="h-[420px] w-full object-cover md:h-[520px]"
                    />
                    <div className="space-y-6 text-base leading-[2] text-ink/75 md:space-y-8">
                      <p>
                        Vaelis was established to build businesses, create opportunities and
                        participate in ventures with long-term potential.
                      </p>
                      <p>
                        Our work spans strategic advisory, business development, representation and
                        investments. We support clients seeking growth, capital, partnerships,
                        market expansion and strategic opportunities, while also investing
                        alongside businesses where we believe we can contribute long-term value.
                      </p>
                      <p className="font-serif text-2xl leading-snug text-ink">
                        Every engagement is approached with a clear objective and managed directly
                        by a partner.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section id="what-we-do" className="bg-beige py-20 md:py-32">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12">
            <Reveal>
              <p className="section-title text-burgundy">What We Do</p>
              <div className="mt-6 h-px w-full bg-ink/15 md:mt-8" />
            </Reveal>

            {/* Negative bottom margin cancels the last article's padding so it doesn't stack on the section padding. */}
            <div className="-mb-8 mt-2 md:-mb-10 md:mt-4">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <article className="group grid gap-4 py-8 md:grid-cols-12 md:gap-12 md:py-10">
                    <h3 className="font-serif text-3xl leading-tight transition-colors duration-700 group-hover:text-burgundy md:col-span-5 md:text-[2.5rem]">
                      {s.title}
                    </h3>
                    <div className="space-y-5 text-base leading-[2] text-ink/75 md:col-span-7 md:col-start-6 md:space-y-6">
                      {s.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHO WE WORK WITH */}
        <section id="who-we-work-with" className="bg-parchment py-20 md:py-32">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <p className="section-title text-burgundy">Who We Work With</p>
                </Reveal>
              </div>
              {/* Curated list: two columns from `sm`, a compact single column below. Markers only, no dividers. */}
              <ul className="sm:columns-2 sm:gap-x-16 lg:col-span-7 lg:col-start-6">
                {CLIENTS.map((c, i) => (
                  <Reveal as="li" key={c} delay={i * 60} className="break-inside-avoid py-1.5 sm:py-2">
                    <span className="group flex items-baseline gap-4 font-serif text-xl font-light leading-snug tracking-wide md:text-2xl">
                      <span aria-hidden="true" className="h-1 w-1 shrink-0 translate-y-[-0.2em] rounded-full bg-burgundy" />
                      <span className="transition-colors duration-700 group-hover:text-burgundy">{c}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* THE FIRM */}
        <section id="the-firm" className="relative overflow-hidden bg-ink py-20 text-parchment md:py-32">
          <img
            src={firmImg}
            alt="Abu Dhabi skyline at dawn"
            width={1920}
            height={1088}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-15"
          />
          <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <p className="section-title text-beige">The Firm</p>
                </Reveal>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <Reveal delay={120}>
                  <p className="font-serif text-3xl font-light leading-[1.35] md:text-[2.75rem]">
                    Vaelis is led by a small team of partners with experience across
                    entrepreneurship, investment, business development and strategic relationships.
                  </p>
                  <div className="mt-10 h-px w-16 bg-beige/40 md:mt-12" />
                  <p className="mt-10 max-w-2xl text-base leading-[2] text-parchment/70 md:mt-12">
                    Every engagement is managed directly by a partner, ensuring continuity,
                    discretion and accountability throughout each mandate.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-ink pb-24 pt-20 text-parchment md:pb-36 md:pt-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <p className="section-title text-beige">Contact</p>
              <p className="mx-auto mt-8 font-serif text-2xl font-light leading-[1.5] md:mt-12 md:text-4xl">
                For business enquiries, investment opportunities or partnership discussions, please
                contact the Vaelis team.
              </p>
              <a
                href="mailto:info@vaelis.com"
                className="eyebrow mt-12 inline-block border border-beige/40 px-12 py-5 text-parchment transition-colors duration-700 hover:border-burgundy hover:bg-burgundy md:mt-14"
              >
                Contact Us
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-ink pb-14 text-parchment">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="h-px w-full bg-parchment/10" />
          <div className="mt-10 flex flex-col items-center justify-between gap-5 md:flex-row">
            <img src={logoLight} alt="Vaelis" width={600} height={100} className="h-3 w-auto opacity-80" />
            <span className="label-sm text-parchment/35">Based in the United Arab Emirates.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
