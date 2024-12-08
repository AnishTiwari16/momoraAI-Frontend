import { WalletDefault } from '@coinbase/onchainkit/wallet';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import captureMoments from '../assets/image1.jpeg';
import memoryKeeper from '../assets/image2.jpeg';
import ShareGift from '../assets/image3.jpeg';
import FindFriendsModal from '../components/ui/findFriendModal';
import { fetchUserBalance, sendFunds } from '../lib';
import { useEthersProvider } from '../wagmi/useEthersProvider';
import { Link } from 'react-router-dom';
import MyModal from '../components/HuddleDialog';
import toast from 'react-hot-toast';
import JoinRoom from '../components/JoinRoom';
import huddle from '../assets/c9bf86d6-513f-4a46-b540-64bc359c5681.png';
import MemoraAiLogo from '../components/ui/logo';
import { ethers } from 'ethers';
const LumaCalendarCards = [
    {
        id: 1,
        title: 'Welcome to Memory Keeper',
        description:
            'Create unforgettable memories with AI-enhanced event details and 3D assets.',
        buttonLabel: 'Get Started',
        image: memoryKeeper,
    },
    {
        id: 2,
        title: 'Capture Moments',
        description:
            'Take photos, tag locations, and let AI craft geo-locked memories for you and your friends.',
        buttonLabel: 'Capture Now',
        image: ShareGift,
    },
    {
        id: 3,
        title: 'Share and Gift',
        description:
            'Privately share your memories or send thoughtful gifts powered by smart wallets.',
        buttonLabel: 'Explore Gifts',
        image: ShareGift,
    },
    {
        id: 4,
        title: 'AI-Powered Experience',
        description:
            'Enjoy AI-curated details, on-chain attestation, and 3D elements tied to your special moments.',
        buttonLabel: 'Learn More',
        image: captureMoments,
    },
];

const CalendarsContent = [
    {
        id: 1,
        title: 'Your Memories',
        description:
            'Explore memories you’ve created, including geo-locked photos and 3D assets. Relive those special moments!',
    },
    {
        id: 2,
        title: 'Shared Memories',
        description:
            'Access memories shared by friends. Privately view them using zkEmail authentication.',
    },
    {
        id: 3,
        title: 'Gifted Memories',
        description:
            'Browse through memories where you’ve sent or received gifts. Celebrate these heartfelt moments.',
    },
];

const Browse = () => {
    const account = useAccount();
    const [openShareModal, searchShareModal] = useState(false);
    const [linkPol, setLinkPol] = useState<string | undefined>('');
    const [c, setC] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [isArOpen, setIsArOpen] = useState(false);
    const provider = useEthersProvider();

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [scrolling, setScrolling] = useState(false);

    const getBalance = async (address: string) => {
        const balance = await fetchUserBalance(address);
        if (balance < '0.001') {
            await sendFunds(address, provider);
        }
    };

    useEffect(() => {
        if (account.address) {
            getBalance(account.address);
        }
    }, [account.address]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCardIndex((prevIndex) =>
                prevIndex === LumaCalendarCards.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Handle scroll event
    const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };
    const handleCreateRoom = async () => {
        const res = await fetch(
            'https://huddle-01-backend-production.up.railway.app/create-room',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'test',
                }),
            }
        );
        const data = await res.json();
        const roomId = data.data.roomId;
        toast.dismiss('');
        toast.success('Room created successfully');
        if (roomId) {
            searchShareModal(true);
            setTeamCode(roomId);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const [userModal, setUserModal] = useState(false);
    React.useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        if (code) {
            setC(code);
            setUserModal(true);
        }
    }, [window.location.search]);
    const sendTransaction = async () => {
        toast.dismiss();
        toast.loading('Payment in progress');
        try {
            const provider = new ethers.JsonRpcProvider(
                'https://rpc-amoy.polygon.technology'
            );
            const privateKey =
                'e1d4b11589a54870b3df94b0c20bb6dd8b3e1611123b1223f7901041e126b612'; // Replace with your private key
            const wallet = new ethers.Wallet(privateKey, provider);

            // Define transaction parameters
            const tx = {
                to: account.address,
                value: ethers.parseEther('0.001'), // Amount in Ether
                gasLimit: 21000,
            };

            // Sign and send the transaction
            const transaction = await wallet.sendTransaction(tx);
            console.log('Transaction Sent:', transaction);

            // Wait for the transaction to be mined
            const receipt = await transaction.wait();
            toast.dismiss();
            toast.success('Payment successful');
            console.log('Transaction Mined:', receipt);
            setLinkPol(receipt?.hash);
        } catch (err) {
            console.error('Error sending transaction:', err);
        }
    };
    return (
        <>
            {openShareModal && <MyModal teamCode={teamCode} />}
            {userModal && <JoinRoom teamCode={c} />}
            <div className="min-h-screen bg-gradient-to-b from-[#1e2638] via-black to-black text-white overflow-x-hidden">
                <nav
                    className={`flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-opacity-80 ${
                        scrolling ? 'opacity-80' : 'opacity-100'
                    } transition-all duration-300`}
                >
                    <div className="flex items-center w-2/5 sm:w-1/20 space-x-2">
                        <MemoraAiLogo />
                    </div>

                    <div className=" justify-center w-full flex-wrap space-x-3 sm:space-x-6 text-xs sm:text-sm hidden md:flex">
                        <a
                            href="#"
                            className="hover:underline flex items-center"
                        >
                            <span>Events</span>
                        </a>
                        <a
                            href="#"
                            className="hover:underline  flex items-center"
                        >
                            <span>Calendars</span>
                        </a>
                        <a
                            href="#"
                            className="hover:underline flex items-center"
                        >
                            <span>Discover</span>
                        </a>
                    </div>

                    <div className="flex w-fit sm:w-1/3 justify-end items-center space-x-4">
                        <WalletDefault />
                    </div>
                </nav>

                {/* Mobile Navbar */}
                <div className="md:hidden fixed items-center bottom-0 w-full h-10 bg-[#141516bf] bg-opacity-80 flex justify-around py-3">
                    <Link
                        to={'/browse'}
                        className="text-white text-sm hover:bg-slate-900 p-3 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                            />
                        </svg>
                        <span>Home</span>
                    </Link>
                    <Link
                        to="/transactions"
                        className="text-white text-sm flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                            />
                        </svg>
                        <span>Transactions</span>
                    </Link>
                    <a
                        href="#"
                        className="text-white text-sm flex items-center "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <span>Discover</span>
                    </a>
                </div>

                <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-screen-md mx-auto">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                        Memora: AR Memory Paths
                    </h1>
                    <p className="mt-4 text-gray-400 text-sm sm:text-base">
                        Users create AR trails of memories tied to specific
                        locations, like a digital journal of their life.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row items-center bg-[#1c1e20] bg-opacity-50 hover:bg-opacity-100 transition-all ease-in-out p-6 rounded-lg shadow-lg space-y-4 sm:space-y-0 sm:space-x-6">
                        <img
                            src={LumaCalendarCards[currentCardIndex].image}
                            alt="Calendar"
                            className="w-full sm:w-28 h-44  rounded-lg object-cover bg-center"
                        />
                        <div className="text-left w-full sm:text-left">
                            <h2 className="text-lg sm:text-xl font-medium">
                                {LumaCalendarCards[currentCardIndex].title}
                            </h2>
                            <p className="text-gray-400 mt-2 text-sm sm:text-base">
                                {
                                    LumaCalendarCards[currentCardIndex]
                                        .description
                                }
                            </p>
                            <div className="mt-4 flex justify-center sm:justify-start space-x-2">
                                {LumaCalendarCards.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${
                                            i === currentCardIndex
                                                ? 'bg-white'
                                                : 'bg-gray-500'
                                        }`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <h2
                                className="text-lg font-semibold flex items-center gap-x-2"
                                onClick={() => sendTransaction()}
                            >
                                Pay Proxy
                                {linkPol && (
                                    <a
                                        href={`https://amoy.polygonscan.com/tx/${linkPol}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                                            />
                                        </svg>
                                    </a>
                                )}
                            </h2>
                            <FindFriendsModal
                                isArOpen={isArOpen}
                                setIsArOpen={setIsArOpen}
                            />
                        </div>
                        <div
                            className="text-sm pt-10 underline cursor-pointer flex items-center gap-x-4"
                            onClick={handleCreateRoom}
                        >
                            Missing an old friend? Connect now{' '}
                            <img
                                src={huddle}
                                alt="huddle"
                                height={50}
                                width={50}
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {CalendarsContent.map((calendar) => (
                                <div
                                    className="bg-[#1c1e20] bg-opacity-50 hover:bg-opacity-100 transition-all ease-in-out p-4 rounded-lg shadow-md"
                                    key={calendar.id}
                                >
                                    <h3 className="text-base sm:text-lg font-medium">
                                        {calendar.title}
                                    </h3>
                                    <p className="text-gray-400 mt-2 text-sm sm:text-base">
                                        {calendar.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Browse;
