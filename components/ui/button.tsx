import Link from "next/link";
import { Magnetic } from "./magnetic";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full px-7 text-sm font-semibold transition-colors duration-500 ease-out-expo";

// Matches the hero CTAs (components/hero/HeroCopy.tsx).
const variants: Record<Variant, string> = {
  primary:
    "bg-red text-white shadow-[0_10px_40px_-10px_rgba(235,0,40,0.8)] hover:bg-[#ff0a35]",
  ghost: "border border-white/30 text-white hover:border-white hover:bg-white/5",
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
    <Link href={href} className={`${base} ${variants[variant]} w-full sm:w-auto ${className}`} {...rest}>
      <span className="relative z-10">{children}</span>
      <Arrow />
    </Link>
  );
  return magnetic ? <Magnetic className="block sm:inline-block">{link}</Magnetic> : link;
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="relative z-10 size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
