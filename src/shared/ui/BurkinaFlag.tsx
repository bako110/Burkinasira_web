interface BurkinaFlagProps {
  className?: string;
}

export function BurkinaFlag({ className }: BurkinaFlagProps) {
  return (
    <svg className={className} viewBox="0 0 900 600" aria-hidden="true" focusable="false">
      <rect width="900" height="300" fill="#EF2B2D" />
      <rect y="300" width="900" height="300" fill="#009739" />
      <polygon
        fill="#FCD116"
        points="450,220 469,280 532,280 481,317 500,377 450,340 400,377 419,317 368,280 431,280"
      />
    </svg>
  );
}
