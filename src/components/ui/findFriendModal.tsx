import { Button, Dialog, DialogPanel } from '@headlessui/react';
import { useEffect, useState } from 'react';
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
const easContractAddress = '0x4200000000000000000000000000000000000021';
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
    const [isGifOpen, setIsGifOpen] = useState(true);
    const [image, setImage] = useState<string | null>(null);
    const signer = useEthersSigner();
    useEffect(() => {
        setIsGifOpen(true);
    }, [isOpen]);
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
                        setIsGifOpen(true);
                    } else {
                        setIsGifOpen(false);
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
        toast.dismiss();
        toast.loading('Creating attestation onchain');
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
        await transaction.wait();
        toast.dismiss();
        toast.success('Attestation created successfully');
        open();
        toast.dismiss();
        toast.loading('Finding Friends Nearby');
        await getAttestations();
        toast.dismiss();
        toast.success('Friends Found Nearby');
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
                                        className="absolute top-0 right-12"
                                        height={120}
                                        width={120}
                                    />
                                </div>
                            ) : (
                                <div
                                    onClick={() => {
                                        setIsArOpen(true);
                                    }}
                                >
                                    Make memories
                                </div>
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
