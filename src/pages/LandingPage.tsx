import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedGradientText } from '../components/ui/AnimatedGradientText';

import { cn } from '../lib/utils';
import { BackgroundLines } from '../components/ui/background-lines';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col items-center bg-black text-white overflow-hidden">
            {/* Navbar */}
            <nav className="w-full flex justify-between items-center p-4 md:px-8 lg:px-16 bg-black relative z-50">
                {/* Hamburger Menu (Visible on smaller devices) */}
                <div className="items-center md:hidden">
                    {!isMenuOpen ? (
                        <svg
                            onClick={() => setIsMenuOpen(true)}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 cursor-pointer text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    ) : (
                        <svg
                            onClick={() => setIsMenuOpen(false)}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 cursor-pointer text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                </div>

                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Logo"
                        className="w-10 h-auto"
                    />
                </div>

                {/* Links (Visible only on desktop) */}
                <div className="hidden md:flex space-x-8 text-sm font-medium">
                    <a href="#" className="hover:underline">
                        Our Vision
                    </a>
                    <a href="#" className="hover:underline">
                        Discover
                    </a>
                    <a href="#" className="hover:underline">
                        Pricing
                    </a>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                    <button className="bg-gray-800 px-4 py-2 rounded-md">
                        <img
                            src="../src/assets/twitter.png"
                            alt="Twitter"
                            className="w-5 h-5"
                        />
                    </button>
                    <Link
                        to={'/browse'}
                        className="bg-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Launch App
                    </Link>
                </div>
            </nav>

            {/* Mobile Menu (Visible when hamburger menu is clicked) */}
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
            <div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden px-4 md:px-8 lg:px-16">
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
                            <Link
                                to={'/browse'}
                                className="group/button relative overflow-hidden rounded-md border border-blue-500/20 bg-white px-4 py-1 text-xs font-medium text-blue-500 transition-all duration-150 hover:border-blue-500 active:scale-95"
                            >
                                <span className="absolute bottom-0 left-0 z-0 h-0 w-full bg-gradient-to-t from-blue-600 to-blue-500 transition-all duration-500 group-hover/button:h-full" />
                                <span className="relative z-10 transition-all duration-500 group-hover/button:text-white">
                                    Launch App
                                </span>
                            </Link>
                        </div>
                    </div>
                </BackgroundLines>
            </div>
        </div>
    );
};

export default LandingPage;
