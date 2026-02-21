interface OctagonBadgeProps {
  label: string;
}

export default function OctagonBadge({ label }: OctagonBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30"
            fill="#1a1a1a"
            stroke="#000"
            strokeWidth="2"
          />
          <text
            x="50"
            y="40"
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            EXCESO
          </text>
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            EN
          </text>
        </svg>
      </div>
      <span className="text-center text-xs font-bold uppercase tracking-wide text-gray-800">
        {label}
      </span>
    </div>
  );
}
