import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedGradientText } from '../components/ui/AnimatedGradientText';

import { cn } from '../lib/utils';
import { BackgroundLines } from '../components/ui/background-lines';
import MemoraAiLogo from '../components/ui/logo';
import { AnimatedTextGradient } from '../components/ui/AnimatedTextGradient';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col items-center  bg-black text-white overflow-hidden">
            <nav className="w-full flex justify-between items-center p-4 md:px-8 lg:px-16 relative z-50">
                <div className="flex items-center ">
                    <MemoraAiLogo />
                </div>
            </nav>

            <div
                className={`absolute top-0 left-0 w-full bg-black bg-opacity-75 transform transition-transform duration-300 z-40 ${
                    isMenuOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="flex flex-col items-center p-6 space-y-4 text-white text-lg">
                    <a
                        href="#"
                        className="hover:underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Our Vision
                    </a>
                    <a
                        href="#"
                        className="hover:underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Discover
                    </a>
                    <a
                        href="#"
                        className="hover:underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Pricing
                    </a>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative flex items-center justify-center w-full min-h-[70vh] overflow-hidden px-4 md:px-8 lg:px-16">
                {/* Background Effect */}
                <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                    {/* Text Content */}
                    <div className="relative z-10 text-center flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
                        <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-5xl lg:text-7xl font-sans py-4 font-bold tracking-tight">
                            Unleash the power of <br />
                            <div className="flex items-end">
                                <AnimatedGradientText className="text-transparent bg-gradient-to-br from-blue-500 to-teal-500 bg-clip-text">
                                    <span
                                        className={cn(
                                            `inline animate-gradient bg-gradient-to-r from-[#40aaff] via-[#40ffaa] to-[#40aaff] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                                        )}
                                    >
                                        web3 Intents
                                    </span>
                                </AnimatedGradientText>
                                with{' '}
                                <AnimatedGradientText className="text-transparent bg-gradient-to-br from-blue-500 to-teal-500 bg-clip-text">
                                    <span
                                        className={cn(
                                            `inline animate-gradient bg-gradient-to-r from-[#40aaff] via-[#40ffaa] to-[#40aaff] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                                        )}
                                    >
                                        AI
                                    </span>
                                </AnimatedGradientText>
                            </div>
                        </h1>
                        <p className="max-w-3xl mx-auto text-sm md:text-lg text-neutral-400 text-center mt-4">
                            Execute transactions, search resources, and retrieve
                            on-chain data by prompting in natural language.
                        </p>
                        {/* Call-to-Action Buttons */}
                        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
                            <Link to={'/browse'}>
                                <AnimatedTextGradient>
                                    Launch App 🚀
                                </AnimatedTextGradient>
                            </Link>
                        </div>
                    </div>
                </BackgroundLines>
            </div>
        </div>
    );
};

export default LandingPage;
