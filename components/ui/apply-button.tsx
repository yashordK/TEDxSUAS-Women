import { site } from "@/lib/site";
import { Arrow } from "./button";

/**
 * The real application link (site.applyUrl). While the form isn't live
 * (applyUrl === "TODO") it renders as a disabled "Applications opening soon".
 */
export function ApplyButton({ className = "" }: { className?: string }) {
  if (site.applyUrl === "TODO") {
    return (
      <button type="button" disabled className={`cta cta-primary cursor-not-allowed opacity-60 ${className}`}>
        <span className="relative z-10">Applications opening soon</span>
      </button>
    );
  }
  return (
    <a href={site.applyUrl} target="_blank" rel="noopener noreferrer" className={`cta cta-primary ${className}`}>
      <span className="relative z-10">Apply to speak</span>
      <Arrow />
    </a>
  );
}
