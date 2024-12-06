import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
export function AnimatedGradientText({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'text-7xl group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4  font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40',
                className
            )}
        >
            {children}
        </div>
    );
}
