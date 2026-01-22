import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../araclar/utils';

const dugmeVaryantlari = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      varyant: {
        primary: "bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-500/20 border border-transparent",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm",
        danger: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20 border border-transparent",
        ghost: "hover:bg-white/10 text-gray-300 hover:text-white",
        link: "text-primary-400 underline-offset-4 hover:underline",
        outline: "border border-white/20 bg-transparent hover:bg-white/5 text-white",
      },
      boyut: {
        sm: "h-9 px-3",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
      tamGenislik: {
        true: "w-full",
      }
    },
    defaultVariants: {
      varyant: "primary",
      boyut: "md",
      tamGenislik: false,
    },
  }
);

export interface DugmeProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dugmeVaryantlari> {
  yukleniyor?: boolean;
  solIkon?: React.ReactNode;
  sagIkon?: React.ReactNode;
}

const Dugme = React.forwardRef<HTMLButtonElement, DugmeProps>(
  ({ className, varyant, boyut, tamGenislik, yukleniyor, solIkon, sagIkon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(dugmeVaryantlari({ varyant, boyut, tamGenislik, className }))}
        ref={ref}
        disabled={disabled || yukleniyor}
        {...props}
      >
        {yukleniyor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!yukleniyor && solIkon && <span className="mr-2">{solIkon}</span>}
        {children}
        {!yukleniyor && sagIkon && <span className="ml-2">{sagIkon}</span>}
      </button>
    );
  }
);
Dugme.displayName = "Dugme";

export { Dugme, dugmeVaryantlari };
