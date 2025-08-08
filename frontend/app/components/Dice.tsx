'use client';

import { useState, useEffect } from 'react';

interface DiceProps {
    value: number;
    isRolling: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const diceDots = {
    1: [[4]],
    2: [[1, 7], [7, 1]],
    3: [[1, 4, 7], [7, 4, 1]],
    4: [[1, 3], [7, 9], [1, 3], [7, 9]],
    5: [[1, 3, 5], [7, 9, 5], [5]],
    6: [[1, 3, 5], [7, 9, 5], [1, 3, 5], [7, 9, 5]],
};

const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
};

export default function Dice({ value, isRolling, size = 'lg' }: DiceProps) {
    const [displayValue, setDisplayValue] = useState(1);

    useEffect(() => {
        if (isRolling) {
            const interval = setInterval(() => {
                setDisplayValue(Math.floor(Math.random() * 6) + 1);
            }, 100);

            return () => clearInterval(interval);
        } else {
            setDisplayValue(value);
        }
    }, [isRolling, value]);

    const dots = diceDots[displayValue as keyof typeof diceDots] || diceDots[1];

    return (
        <div className={`relative ${sizeClasses[size]} bg-white rounded-lg shadow-lg border-2 border-gray-300 flex items-center justify-center`}>
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2">
                {dots.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center items-center">
                        {row.map((dot, dotIndex) => (
                            <div
                                key={dotIndex}
                                className={`w-2 h-2 bg-black rounded-full ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : 'w-2 h-2'
                                    }`}
                                style={{
                                    gridColumn: Math.ceil(dot / 3),
                                    gridRow: ((dot - 1) % 3) + 1,
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {isRolling && (
                <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
}
