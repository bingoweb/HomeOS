import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../araclar/utils';

const kartVaryantlari = cva(
  "rounded-2xl overflow-hidden transition-all",
  {
    variants: {
      varyant: {
        glass: "glass-card",
        solid: "bg-dark-800 border border-white/10 shadow-lg",
        bordered: "border-2 border-dashed border-white/10 bg-transparent",
        gradient: "bg-gradient-to-br from-primary-900/50 to-dark-900 border border-primary-500/20",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hoverEfekt: {
        true: "hover:border-primary-500/30 hover:shadow-xl hover:-translate-y-1 duration-300",
        false: ""
      }
    },
    defaultVariants: {
      varyant: "glass",
      padding: "md",
      hoverEfekt: false,
    },
  }
);

export interface KartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kartVaryantlari> {
  baslik?: React.ReactNode;
  altBaslik?: React.ReactNode;
  altKisim?: React.ReactNode;
}

const Kart = React.forwardRef<HTMLDivElement, KartProps>(
  ({ className, varyant, padding, hoverEfekt, baslik, altBaslik, altKisim, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(kartVaryantlari({ varyant, padding, hoverEfekt, className }))}
        {...props}
      >
        {(baslik || altBaslik) && (
          <div className="mb-4 space-y-1">
            {baslik && <div className="text-lg font-semibold text-white">{baslik}</div>}
            {altBaslik && <div className="text-sm text-gray-400">{altBaslik}</div>}
          </div>
        )}

        <div className="relative">
          {children}
        </div>

        {altKisim && (
          <div className="mt-4 pt-4 border-t border-white/10">
            {altKisim}
          </div>
        )}
      </div>
    );
  }
);
Kart.displayName = "Kart";

export { Kart };
