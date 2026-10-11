import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-entry reveal. One mechanism, four looks:
 *  - "up"   fade + short rise (default, for paragraphs and small labels)
 *  - "clip" line-mask: content rises out of a clip (serif headings)
 *  - "wipe" clip-path wipe + gentle settle of the image inside (images)
 *  - "line" draws a hairline from left to right (dividers)
 *
 * Content is visible by default if IntersectionObserver is missing, the element
 * is already in view (or above it) on mount, or the user prefers reduced motion.
 */
export type RevealVariant = "up" | "clip" | "wipe" | "line";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: "reveal",
  clip: "reveal reveal-clip",
  wipe: "reveal reveal-wipe",
  line: "reveal reveal-line",
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children?: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "p" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    // Already scrolled past (e.g. deep-link load): show immediately, no animation queue.
    if (el.getBoundingClientRect().bottom < 0) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as "div";
  // Chrome's IntersectionObserver reports a clip-path'd target as non-intersecting, so the
  // observed element stays unclipped and the clip lives on an inner mask.
  const inner =
    variant === "clip" ? (
      <div className="reveal-mask">
        <div className="reveal-clip-inner">{children}</div>
      </div>
    ) : variant === "wipe" ? (
      <div className="reveal-mask">{children}</div>
    ) : (
      children
    );

  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      data-visible={visible}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={`${VARIANT_CLASS[variant]} ${className}`}
    >
      {inner}
    </Comp>
  );
}
