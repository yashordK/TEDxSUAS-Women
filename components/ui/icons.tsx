type IconProps = { className?: string };

export function CalendarIcon({ className = "size-8" }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="6.5" width="24" height="21" rx="2.5" />
      <path d="M4 12.5h24M10 4v5M16 4v5M22 4v5" strokeLinecap="round" />
      <path d="M9 17h3M14.5 17h3M20 17h3M9 22h3M14.5 22h3M20 22h3" strokeLinecap="round" />
    </svg>
  );
}

export function PinIcon({ className = "size-8" }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M16 29s9-8.6 9-16a9 9 0 1 0-18 0c0 7.4 9 16 9 16Z" strokeLinejoin="round" />
      <circle cx="16" cy="13" r="3.5" />
    </svg>
  );
}
