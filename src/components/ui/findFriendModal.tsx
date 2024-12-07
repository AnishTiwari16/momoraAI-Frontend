import { Button, Dialog, DialogPanel } from '@headlessui/react';
import { useState } from 'react';
import findFriendsGif from '../../assets/worldwide.gif';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { GradualSpacing } from './GradualSpacing';
import { useEthersSigner } from '../../wagmi/useEthersSigner';
import ss from '../../../public/ss.png';
import {
    extractCoordinates,
    getUserLocation,
    haversineDistance,
    hexToString,
} from '../../lib';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import Ar from '../Ar';
import StarWarsButton from './ButtonNext';
export const easContractAddress = '0x4200000000000000000000000000000000000021';
const schemaUID =
    '0x0d24b34bf33676733015b66b9cdc5a0b6a3f636e61e217de3b249249c66d45b1';
export default function FindFriendsModal({
    isArOpen,
    setIsArOpen,
}: {
    isArOpen: boolean;
    setIsArOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const account = useAccount();
    const [isGifOpen, setIsGifOpen] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<any>({
        latitude: 0,
        longitude: 0,
    });
    const signer = useEthersSigner();
    function open() {
        setIsOpen(true);
    }
    function close() {
        setIsOpen(false);
    }
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
                        toast.dismiss();
                        toast.success('Friends Found Nearby');
                        setIsGifOpen(false);
                    } else {
                        setIsGifOpen(false);
                        toast.dismiss();
                        toast.success('No Friends Found Nearby!');
                        close();
                    }
                }
            } else {
                console.error('No attestations found.');
            }
        } catch (error) {
            console.error('Error fetching attestation data:', error);
        }
    };
    const handleAttest = async () => {
        toast.loading('Creating attestation onchain');
        const location = await getUserLocation();
        setLocation(location);
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
        toast.dismiss();
        toast.loading('Attesting onchain please wait');
        await transaction.wait();
        toast.dismiss();
        toast.success('Attestation created successfully');
        toast.dismiss();
        toast.loading('Finding Friends Nearby');
        open();
        setIsGifOpen(true);
        await getAttestations();
    };
    const handleEas = async () => {
        await handleAttest();
    };
    return (
        <>
            <Button
                onClick={() => {
                    handleEas();
                }}
                className=" bg-white text-black px-4 py-2 rounded-lg text-sm font-medium focus:outline-none data-[hover]:bg-white/30 data-[focus]:outline-1 data-[focus]:outline-white"
            >
                Find Friends
            </Button>
            <Dialog
                open={isOpen}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={close}
                __demoMode
            >
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-[300px] rounded-xl bg-white/25 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            {isArOpen ? (
                                <Ar
                                    location={location}
                                    setIsArOpen={setIsArOpen}
                                    setImage={setImage}
                                />
                            ) : isGifOpen ? (
                                <div className="text-left">
                                    <GradualSpacing
                                        duration={0.5}
                                        delayMultiple={0.08}
                                        className="font-display text-left text-xs    font-bold -tracking-widest text-black dark:text-white  md:leading-[3rem]"
                                        text="Finding Friends Nearby ....."
                                    />
                                    <img
                                        src={findFriendsGif}
                                        alt="loading....."
                                        className="rounded-full p-5 m-2"
                                    />
                                </div>
                            ) : image ? (
                                <div className="relative">
                                    <img
                                        src={image}
                                        alt="Captured Screenshot"
                                    />
                                    <img
                                        src={ss}
                                        alt="Overlay"
                                        className="absolute top-0 right-1"
                                        height={120}
                                        width={120}
                                    />
                                </div>
                            ) : (
                                <div
                                    onClick={() => {
                                        setIsArOpen(true);
                                    }}
                                    className="flex items-center justify-center flex-col"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="#ffffff"
                                        className="size-16 mb-7 border rounded-full p-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                                        />
                                    </svg>

                                    <StarWarsButton />
                                </div>
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
