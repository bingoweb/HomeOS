import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../araclar/utils';

const girdiVaryantlari = cva(
  "flex h-11 w-full rounded-xl border bg-white/5 px-3 py-2 text-sm ring-offset-dark-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
  {
    variants: {
      durum: {
        varsayilan: "border-white/10 text-white focus:border-primary-500",
        hata: "border-red-500/50 text-red-500 focus:ring-red-500 bg-red-500/5",
        basari: "border-green-500/50 text-green-500 focus:ring-green-500 bg-green-500/5",
      },
      boyut: {
        sm: "h-9 text-xs",
        md: "h-11",
        lg: "h-14 text-base",
      }
    },
    defaultVariants: {
      durum: "varsayilan",
      boyut: "md",
    },
  }
);

export interface GirdiProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof girdiVaryantlari> {
  etiket?: string;
  hataMesaji?: string;
  yardimMetni?: string;
  solIkon?: React.ReactNode;
  sagIkon?: React.ReactNode;
}

const Girdi = React.forwardRef<HTMLInputElement, GirdiProps>(
  ({ className, type, durum, boyut, etiket, hataMesaji, yardimMetni, solIkon, sagIkon, ...props }, ref) => {
    const [sifreyiGoster, setSifreyiGoster] = useState(false);
    const isPassword = type === 'password';

    // Hata durumu varsa otomatik olarak hata varyantını seç
    const computedDurum = hataMesaji ? 'hata' : durum;

    return (
      <div className="w-full space-y-2">
        {etiket && (
          <label className="text-sm font-medium text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {etiket}
          </label>
        )}
        <div className="relative">
          {solIkon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {solIkon}
            </div>
          )}

          <input
            type={isPassword ? (sifreyiGoster ? 'text' : 'password') : type}
            className={cn(
              girdiVaryantlari({ durum: computedDurum, boyut, className }),
              solIkon && "pl-10",
              (sagIkon || isPassword) && "pr-10"
            )}
            ref={ref}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setSifreyiGoster(!sifreyiGoster)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {sifreyiGoster ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : sagIkon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {sagIkon}
            </div>
          ) : null}
        </div>

        {hataMesaji && (
          <div className="flex items-center gap-1 text-red-400 text-xs animate-fade-in">
            <AlertCircle size={12} />
            <span>{hataMesaji}</span>
          </div>
        )}

        {!hataMesaji && yardimMetni && (
          <p className="text-xs text-gray-500">{yardimMetni}</p>
        )}
      </div>
    );
  }
);
Girdi.displayName = "Girdi";

export { Girdi };
