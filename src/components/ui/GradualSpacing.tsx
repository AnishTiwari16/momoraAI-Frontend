import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
interface GradualSpacingProps {
    text: string;
    duration?: number;
    delayMultiple?: number;
    className?: string;
}
export function GradualSpacing({
    text,
    duration = 0.5,
    delayMultiple = 0.04,
    className,
}: GradualSpacingProps) {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(
                () => setVisible(true),
                duration * 1000 + delayMultiple * text.length * 1000
            );
        }, duration * 1000 + delayMultiple * text.length * 1000);
        return () => clearInterval(interval);
    }, [text, duration, delayMultiple]);
    return (
        <div className="flex justify-center space-x-1">
            <AnimatePresence>
                {visible &&
                    text.split('').map((char, i) => (
                        <motion.h1
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration, delay: i * delayMultiple }}
                            className={cn('drop-shadow-sm', className)}
                        >
                            {char === ' ' ? <span>&nbsp;</span> : char}
                        </motion.h1>
                    ))}
            </AnimatePresence>
        </div>
    );
}
