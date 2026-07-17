import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  className,
  duration = 700,
}: Props) {
  const n = useAnimatedNumber(value, duration);
  const formatted = n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className} data-value={value}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
