// ============================================
// SİSTEM GÖSTERGE BİLEŞENİ
// ============================================

interface SistemGostergeProps {
    deger: number;
    renk: string;
    boyut?: number;
}

export default function SistemGostergesi({ deger, renk, boyut = 120 }: SistemGostergeProps) {
    const yaricap = (boyut - 20) / 2;
    const cevre = 2 * Math.PI * yaricap;
    const ilerleme = ((100 - Math.min(deger, 100)) / 100) * cevre;

    return (
        <div className="flex justify-center">
            <div className="relative" style={{ width: boyut, height: boyut }}>
                <svg className="transform -rotate-90" width={boyut} height={boyut}>
                    {/* Arka plan çemberi */}
                    <circle
                        cx={boyut / 2}
                        cy={boyut / 2}
                        r={yaricap}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="10"
                        fill="none"
                    />
                    {/* İlerleme çemberi */}
                    <circle
                        cx={boyut / 2}
                        cy={boyut / 2}
                        r={yaricap}
                        stroke={renk}
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={cevre}
                        strokeDashoffset={ilerleme}
                        className="transition-all duration-500 ease-out"
                        style={{
                            filter: `drop-shadow(0 0 8px ${renk}40)`
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                        {Math.round(deger)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
