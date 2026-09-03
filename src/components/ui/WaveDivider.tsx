interface WaveDividerProps {
  className?: string;
  color?: string;
  flip?: boolean;
}

/** Divisor SVG orgánico y fluido para transiciones entre secciones. */
export function WaveDivider({
  className,
  color = "#F4F2EE",
  flip = false
}: WaveDividerProps) {
  return (
    <div
      className={className}
      style={{ transform: flip ? "scaleY(-1)" : undefined, lineHeight: 0 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path
          fill={color}
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,128 1440,64 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
