import { WalletDefault } from '@coinbase/onchainkit/wallet';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import React from 'react';
import { useAccount } from 'wagmi';
import '../App.css';
import calenderImage from '../assets/calenderImage.png';
import {
    extractCoordinates,
    fetchUserBalance,
    getUserLocation,
    haversineDistance,
    hexToString,
    sendFunds,
} from '../lib';
import { useEthersSigner } from '../wagmi/useEthersSigner';
import { useEthersProvider } from '../wagmi/useEthersProvider';
const easContractAddress = '0x4200000000000000000000000000000000000021';
const schemaUID =
    '0x0d24b34bf33676733015b66b9cdc5a0b6a3f636e61e217de3b249249c66d45b1';
const CalendarsContent = [
    {
        id: 1,
        title: 'My Calendars',
        description: 'You are not an admin of any calendars.',
    },
    {
        id: 2,
        title: 'My Calendars',
        description: 'You are not an admin of any calendars.',
    },
    {
        id: 3,
        title: 'My Calendars',
        description: 'You are not an admin of any calendars.',
    },
];
const Browse = () => {
    const account = useAccount();
    const [isFriendClose, setIsFriendClose] = React.useState(false);
    const signer = useEthersSigner();
    const provider = useEthersProvider();
    const handleAttest = async () => {
        console.log('calling function');
        const location = await getUserLocation();
        const eas: any = new EAS(easContractAddress);
        eas.connect(signer);
        const schemaEncoder = new SchemaEncoder(
            'address smart_wallet,string user_email,string[] location_coordinates'
        );
        const encodedData = schemaEncoder.encodeData([
            {
                name: 'smart_wallet',
                value: account.address || '',
                type: 'address',
            },
            { name: 'user_email', value: 'anishtiw', type: 'string' },
            {
                name: 'location_coordinates',
                value: [
                    `Latitude: ${location.latitude}`,
                    `Longitude: ${location.longitude}`,
                ],
                type: 'string[]',
            },
        ]);
        const transaction = await eas.attest({
            schema: schemaUID,
            data: {
                recipient: account.address,
                expirationTime: 0,
                revocable: true,
                data: encodedData,
            },
        });
        const newAttestationUID = await transaction.wait();
        console.log('New attestation UID:', newAttestationUID);
    };

    const handleMakeFriends = async () => {
        await handleAttest();
    };
    const getBalance = async (address: string) => {
        const balance = await fetchUserBalance(address);
        if (balance < '0.001') {
            await sendFunds(address, provider);
        }
    };
    React.useEffect(() => {
        if (account.address) {
            getBalance(account.address);
        }
    }, [account.address]);
    const handleAttestation = async () => {
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
                                schemaId: {
                                    equals: '0x0d24b34bf33676733015b66b9cdc5a0b6a3f636e61e217de3b249249c66d45b1',
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

            if (result.data.attestations.length > 0) {
                // Fetch details for each attestation
                const attestationDetailsPromises = result.data.attestations.map(
                    async (attestation: any) => {
                        const attestationId = attestation.id;

                        const attestationDetailsResponse = await fetch(
                            'https://base-sepolia.easscan.org/graphql',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    query: `
                                    query Attestation($id: String!) {
                                        attestation(where: { id: $id }) {
                                            id
                                            attester
                                            recipient
                                            refUID
                                            revocable
                                            revocationTime
                                            expirationTime
                                            data
                                        }
                                    }
                                `,
                                    variables: {
                                        id: attestationId,
                                    },
                                }),
                            }
                        );

                        const attestationDetailsResult =
                            await attestationDetailsResponse.json();
                        return attestationDetailsResult.data.attestation;
                    }
                );

                // Wait for all promises to resolve
                const details = await Promise.all(attestationDetailsPromises);
                const first = details[0].data;
                const second = details[1].data;
                const firstHex = hexToString(first);
                const secondHex = hexToString(second);
                const { latitude: FirstLat, longitude: FirstLong } =
                    extractCoordinates(firstHex);
                const { latitude: secondLat, longitude: secondLong } =
                    extractCoordinates(secondHex);

                if (FirstLat && FirstLong && secondLat && secondLong) {
                    const distance = haversineDistance(
                        FirstLat,
                        FirstLong,
                        secondLat,
                        secondLong
                    );
                    if (distance <= 10) {
                        setIsFriendClose(true);
                    } else {
                        setIsFriendClose(false);
                    }
                }
            } else {
                console.error('No attestations found.');
            }
        } catch (error) {
            console.error('Error fetching attestation data:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#102724] via-black to-black text-white">
            <nav className="flex items-center justify-between px-4 py-4 bg-opacity-80">
                {/* Left - Logo or Icon */}
                <div className="flex items-center w-[20%] sm:w-[10%] space-x-2">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>

                {/* Center - Navigation Links */}
                <div className="flex justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
                    <a
                        href="#"
                        className="hover:underline flex items-center space-x-1"
                    >
                        {/* SVG Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                            />
                        </svg>
                        <span className="hidden sm:block">Events</span>
                    </a>
                    <a
                        href="#"
                        className="hover:underline flex items-center space-x-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                            />
                        </svg>
                        <span className="hidden sm:block">Calendars</span>
                    </a>
                    <a
                        href="#"
                        className="hover:underline flex items-center space-x-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <span className="hidden sm:block">Discover</span>
                    </a>
                </div>

                {/* Right - Actions */}
                <div className="flex w-full sm:w-[30%] justify-end items-center space-x-4">
                    <span className="text-xs text-center sm:text-sm">
                        12:59 PM GMT+5:30
                    </span>
                    {/* <button className="text-xs sm:text-sm font-medium hover:underline">
                        Connect wallet
                    </button> */}
                    <WalletDefault />
                </div>
            </nav>

            {/* Main Content */}
            <div className="py-6 px-4 sm:px-6 md:px-8 max-w-screen-lg mx-auto">
                {/* Page Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold">
                    Random text
                </h1>

                {/* Welcome Card */}
                <div className="mt-6 bg-[#1c1e20] flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 bg-opacity-50 hover:bg-opacity-100 transition-all ease-in-out p-6 rounded-lg shadow-lg">
                    <img
                        src={calenderImage}
                        alt="Calendar Image"
                        className="w-full sm:w-28 h-28 rounded-lg"
                    />
                    <div>
                        <h2 className="text-lg font-medium">
                            Welcome to Luma Calendar
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Luma Calendar lets you easily share and manage your
                            events. Every event on Luma is part of a calendar.
                            Let’s see how they work.
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-gray-500"
                                    ></div>
                                ))}
                            </div>
                            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* My Calendars Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">My Calendars</h2>
                        <button
                            onCanPlay={handleMakeFriends}
                            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Add friends
                        </button>
                    </div>
                    <div>{isFriendClose}</div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {CalendarsContent.map((calendar) => (
                            <div
                                className="bg-[#1c1e20] bg-opacity-50 hover:bg-opacity-100 transition-all ease-in-out p-4 rounded-lg shadow-md"
                                key={calendar.id}
                            >
                                <h3 className="text-lg font-medium">
                                    {calendar.title}
                                </h3>
                                <p className="text-gray-400 mt-2">
                                    {calendar.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div onClick={handleAttestation}>Get attestations</div>
            </div>
        </div>
    );
};

export default Browse;
