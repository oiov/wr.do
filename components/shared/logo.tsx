export default function LogoIcon({
  className,
  ...props
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path color="#0070f3" strokeWidth="3" d="m12 14 4-4" />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            style={{ stopColor: "rgb(35, 35, 35)", stopOpacity: "1" }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "rgb(100, 100, 100)", stopOpacity: "1" }}
          />
        </linearGradient>
      </defs>
      <path
        d="M3.34 19a10 10 0 1 1 17.32 0"
        stroke="url(#gradient)"
        strokeWidth="3"
      />
    </svg>
  );
}
