import { cn } from '../araclar/utils';

interface IskeletProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Iskelet({ className, ...props }: IskeletProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/10", className)}
      {...props}
    />
  );
}
