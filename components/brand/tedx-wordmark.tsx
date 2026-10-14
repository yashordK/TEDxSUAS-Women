import Image from "next/image";

/**
 * The official event lockup (public/brand/logo-white.png, 2744×440).
 * Per TEDx rules: no animation, recolouring or effects are applied to this mark.
 * Sized by font-size: the image is 1em tall.
 */
export function TedxWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block leading-none ${className}`}>
      <Image
        src="/brand/logo-white.png"
        alt="TEDxSUAS Women"
        width={2744}
        height={440}
        className="h-[1em] w-auto"
      />
    </span>
  );
}
