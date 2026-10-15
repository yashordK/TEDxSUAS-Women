import Image from "next/image";

/**
 * The theme calligraphy as artwork (public/brand/theme-words.png): the two words only,
 * recoloured to the site reds (#EB0028 body, #FF3B55 highlight) with the black field
 * keyed to transparency, so it sits on any background or glow without a box.
 * Built from logo-theme.png; the hero keeps its own art.
 */
export function ThemeWords({
  className = "",
  widthClass = "w-[clamp(280px,62vw,860px)]",
}: {
  className?: string;
  widthClass?: string;
}) {
  return (
    <Image
      src="/brand/theme-words.png"
      alt="त्वमेव परिवर्तनम् (Twamev Parivartanam): you are the change"
      width={1545}
      height={426}
      sizes="(min-width: 1400px) 860px, 62vw"
      className={`h-auto ${widthClass} ${className}`}
    />
  );
}
