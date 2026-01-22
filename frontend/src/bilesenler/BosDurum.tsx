import { LucideIcon, PackageOpen } from 'lucide-react';
import { Dugme } from './Dugme';
import { cn } from '../araclar/utils';

interface BosDurumProps {
  ikon?: LucideIcon;
  baslik: string;
  aciklama?: string;
  dugmeMetni?: string;
  dugmeTiklama?: () => void;
  className?: string;
}

export const BosDurum = ({
  ikon: Ikon = PackageOpen,
  baslik,
  aciklama,
  dugmeMetni,
  dugmeTiklama,
  className
}: BosDurumProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center animate-fade-in", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6">
        <Ikon className="h-10 w-10 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        {baslik}
      </h3>

      {aciklama && (
        <p className="text-gray-400 max-w-sm mb-6">
          {aciklama}
        </p>
      )}

      {dugmeMetni && dugmeTiklama && (
        <Dugme onClick={dugmeTiklama} varyant="secondary">
          {dugmeMetni}
        </Dugme>
      )}
    </div>
  );
};
