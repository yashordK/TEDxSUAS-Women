import Link from "next/link";
import { Magnetic } from "./magnetic";

type Variant = "primary" | "ghost";

// Styles live in globals.css (.cta*) so they match the hero CTAs exactly.
const variants: Record<Variant, string> = {
  primary: "cta cta-primary",
  ghost: "cta cta-link",
};

export function Button({
  href,
  variant = "primary",
  magnetic = true,
  children,
  className = "",
  ...rest
}: {
  href: string;
  variant?: Variant;
  magnetic?: boolean;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  const link = (
    <Link href={href} className={`${variants[variant]} w-full sm:w-auto ${className}`} {...rest}>
      <span className="cta-label relative z-10">{children}</span>
      <Arrow down={variant === "ghost" && href.startsWith("#")} />
    </Link>
  );
  return magnetic ? <Magnetic className="block sm:inline-block">{link}</Magnetic> : link;
}

export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="cta-arrow relative z-10" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={down ? "M12 4v15M6 13l6 6 6-6" : "M4 12h15M13 6l6 6-6 6"} />
    </svg>
  );
}
