import React from 'react';

const MemoraAiLogo: React.FC<{ width?: number; height?: number }> = ({
    width = 200,
    height = 60,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 200 60"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Text Gradient */}
                <linearGradient
                    id="textGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stopColor="#00A9F4" />
                    <stop offset="100%" stopColor="#6EF3C7" />
                </linearGradient>
            </defs>

            {/* Black Background Rectangle */}
            <rect width="200" height="60" rx="10" fill="black" />

            {/* Gradient Text */}
            <text
                x="80"
                y="38"
                fontFamily="Arial, sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="url(#textGradient)"
                textAnchor="middle"
            >
                memoraAi
            </text>

            {/* Circle */}
            <circle cx="140" cy="30" r="15" fill="white" fillOpacity="0.2" />
        </svg>
    );
};

export default MemoraAiLogo;
