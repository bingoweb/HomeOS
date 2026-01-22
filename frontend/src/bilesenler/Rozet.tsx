import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../araclar/utils';

const rozetVaryantlari = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      varyant: {
        varsayilan: "border-transparent bg-primary-500 text-white shadow hover:bg-primary-500/80",
        ikincil: "border-transparent bg-white/10 text-gray-100 hover:bg-white/20",
        outline: "text-gray-100 border-white/20",
        basari: "border-transparent bg-green-500/15 text-green-400 hover:bg-green-500/25 border-green-500/20",
        hata: "border-transparent bg-red-500/15 text-red-400 hover:bg-red-500/25 border-red-500/20",
        uyari: "border-transparent bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/20",
        bilgi: "border-transparent bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border-blue-500/20",
      },
      boyut: {
        sm: "h-5 text-[10px] px-2",
        md: "h-6 text-xs px-2.5",
        lg: "h-7 text-sm px-3",
      },
      dot: {
        true: "pl-2",
        false: ""
      }
    },
    defaultVariants: {
      varyant: "varsayilan",
      boyut: "md",
      dot: false,
    },
  }
);

export interface RozetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rozetVaryantlari> {
  sayac?: number;
}

function Rozet({ className, varyant, boyut, dot, children, sayac, ...props }: RozetProps) {
  return (
    <div className={cn(rozetVaryantlari({ varyant, boyut, dot }), className)} {...props}>
      {dot && (
        <span className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          varyant === 'basari' ? 'bg-green-400' :
          varyant === 'hata' ? 'bg-red-400' :
          varyant === 'uyari' ? 'bg-yellow-400' :
          varyant === 'bilgi' ? 'bg-blue-400' :
          'bg-current'
        )} />
      )}
      {children}
      {sayac !== undefined && (
        <span className="ml-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-white/20 px-1 text-[10px]">
          {sayac > 99 ? '99+' : sayac}
        </span>
      )}
    </div>
  );
}

export { Rozet, rozetVaryantlari };
