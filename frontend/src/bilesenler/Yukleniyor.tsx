import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../araclar/utils';

const spinnerVaryantlari = cva(
  "animate-spin text-primary-500",
  {
    variants: {
      boyut: {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
      renk: {
        primary: "text-primary-500",
        white: "text-white",
        gray: "text-gray-400",
      }
    },
    defaultVariants: {
      boyut: "md",
      renk: "primary",
    },
  }
);

export interface YukleniyorProps extends VariantProps<typeof spinnerVaryantlari> {
  className?: string;
  tamSayfa?: boolean;
  metin?: string;
}

export const Yukleniyor = ({ className, boyut, renk, tamSayfa, metin }: YukleniyorProps) => {
  if (tamSayfa) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm">
        <Loader2 className={cn(spinnerVaryantlari({ boyut: "xl", renk, className }))} />
        {metin && <p className="mt-4 text-gray-300 font-medium animate-pulse">{metin}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={cn(spinnerVaryantlari({ boyut, renk, className }))} />
      {metin && <span className="text-sm text-gray-400">{metin}</span>}
    </div>
  );
};
