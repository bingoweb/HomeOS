interface SystemGaugeProps {
    value: number;
    color: string;
    size?: number;
}

export default function SystemGauge({ value, color, size = 120 }: SystemGaugeProps) {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = ((100 - Math.min(value, 100)) / 100) * circumference;

    return (
        <div className="flex justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90" width={size} height={size}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="10"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={progress}
                        className="transition-all duration-500 ease-out"
                        style={{
                            filter: `drop-shadow(0 0 8px ${color}40)`
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                        {Math.round(value)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
