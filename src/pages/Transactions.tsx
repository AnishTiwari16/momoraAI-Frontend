import { WalletDefault } from '@coinbase/onchainkit/wallet';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

const Transactions = () => {
    const account = useAccount();
    interface Attestation {
        id: string;
        recipient: string;
        schemaId: string;
        time: string;
    }

    const [res, setRes] = useState<Attestation[]>([]);
    const getAttestations = async () => {
        try {
            // Step 1: Fetch the list of attestations
            const response = await fetch(
                'https://base-sepolia.easscan.org/graphql',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!], $take: Int) {
                                attestations(where: $where, orderBy: $orderBy, take: $take) {
                                    id
                                    recipient
                                    schemaId
                                    time
                                }
                            }
                        `,
                        variables: {
                            where: {
                                recipient: {
                                    equals: account.address,
                                },
                            },
                            orderBy: [
                                {
                                    time: 'desc',
                                },
                            ],
                            take: 10,
                        },
                    }),
                }
            );

            const result = await response.json();
            setRes(result.data.attestations);
        } catch (error) {
            console.error('Error fetching attestation data:', error);
        }
    };
    React.useEffect(() => {
        getAttestations();
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1e2638] via-black to-black text-white overflow-x-hidden">
            <nav
                className={`opacity-100 flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-opacity-80 transition-all duration-300`}
            >
                <div className="flex items-center w-1/5 sm:w-1/20 space-x-2">
                    <span className="text-xs">memoraAi</span>
                </div>

                <div className=" justify-center w-full flex-wrap space-x-3 sm:space-x-6 text-xs sm:text-sm hidden md:flex">
                    <a href="#" className="hover:underline flex items-center">
                        <span>Events</span>
                    </a>
                    <a href="#" className="hover:underline  flex items-center">
                        <span>Calendars</span>
                    </a>
                    <a href="#" className="hover:underline flex items-center">
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
                <a href="#" className="text-white text-sm flex items-center ">
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
                <h1 className="flex items-center gap-x-4 text-xl sm:text-2xl lg:text-3xl font-semibold">
                    Recent Transactions{' '}
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
                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                    </svg>
                </h1>
                <p className="my-4 text-gray-400 text-sm sm:text-base">
                    {`View list of all your transactions of ${
                        account.address?.slice(0, 6) +
                        '...' +
                        account.address?.slice(-6)
                    }`}
                </p>
                {res?.map((item, index) => {
                    return (
                        <Link
                            to={`https://base-sepolia.easscan.org/attestation/view/${item.id}`}
                            target="_blank"
                            rel="noreferrer"
                            key={index}
                            className="py-3 flex items-center gap-x-4 underline"
                        >
                            <div>{index + 1}.</div>
                            <div>
                                {item.id.slice(0, 14) +
                                    '...' +
                                    item.id.slice(-14)}
                            </div>
                            <svg
                                stroke="currentColor"
                                fill="none"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
                                <path d="M11 13l9 -9"></path>
                                <path d="M15 4h5v5"></path>
                            </svg>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Transactions;
