interface OctagonBadgeProps {
  label: string;
}

export default function OctagonBadge({ label }: OctagonBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <polygon
            points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30"
            fill="#1a1a1a"
            stroke="#1a1a1a"
            strokeWidth="1"
          />
          <text
            x="50"
            y="42"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="bold"
          >
            EXCESO
          </text>
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="bold"
          >
            EN
          </text>
        </svg>
      </div>
      <span className="text-center text-xs font-semibold text-gray-700">
        {label}
      </span>
    </div>
  );
}
