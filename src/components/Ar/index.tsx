import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import WhirlpoolLoader from '../ui/WhirlpoolLoader';
const WebcamBackground = () => {
    return (
        <video
            autoPlay
            playsInline
            muted
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: -1,
            }}
            ref={(video) => {
                if (video) {
                    navigator.mediaDevices
                        .getUserMedia({ video: true })
                        .then((stream) => {
                            video.srcObject = stream;
                        })
                        .catch((err) => console.error('Camera Error:', err));
                }
            }}
        />
    );
};

// 3D Model Component
const NFTModel = () => {
    const modelRef: any = useRef();
    const { scene } = useGLTF('/nft.glb'); // Load the 3D model

    // Rotate the model for some animation
    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.y += 0.01; // Adjust rotation speed
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={[1.5, 1.5, 1.5]}
            position={[0.2, 2, 0]}
        />
    );
};

const ArComponent = ({
    location,
    setImage,
    setIsArOpen,
}: {
    location: any;
    setImage: (image: string | null) => void;
    setIsArOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [isNftEnabled, setIsNftEnabled] = useState(false);
    const [isNftLoading, setIsNftLoading] = useState(false);
    const account = useAccount();
    // const handleAttestNFT = async () => {
    //     const provider = new ethers.JsonRpcProvider('https://sepolia.base.org'); // Replace with your RPC URL
    //     const wallet = new ethers.Wallet(
    //         'e1d4b11589a54870b3df94b0c20bb6dd8b3e1611123b1223f7901041e126b612',
    //         provider
    //     );
    //     const eas: any = new EAS(easContractAddress);
    //     eas.connect(wallet);
    //     const schemaEncoder = new SchemaEncoder(
    //         'string event_name,string event_description,string occassion,string[] location_coordinates,string memory_description'
    //     );
    //     const encodedData = schemaEncoder.encodeData([
    //         {
    //             name: 'event_name',
    //             value: 'ETH INDIA 2024',
    //             type: 'string',
    //         },
    //         {
    //             name: 'event_description',
    //             value: 'Transcend hierarchies, embrace self-sovereignty and collectively nurture Ethereums ever-evolving ecosystem at the ETHIndia 2024 hackathon.',
    //             type: 'string',
    //         },
    //         { name: 'occassion', value: 'Hackathon', type: 'string' },
    //         {
    //             name: 'location_coordinates',
    //             value: [location.latitude, location.longitude],
    //             type: 'string[]',
    //         },
    //         {
    //             name: 'memory_description',
    //             value: 'Happy memories from ETHIndia 2024',
    //             type: 'string',
    //         },
    //     ]);
    //     const tx = await eas.attest({
    //         schema: '0x0ab02d640f0bb27a4b16a89bb51e53fbe1693647bcb02048650d32a7d6cc8d40',
    //         data: {
    //             recipient: account.address,
    //             expirationTime: 0,
    //             revocable: true,
    //             data: encodedData,
    //         },
    //     });
    //     return await tx.wait();
    // };
    const captureScreenshot = () => {
        const element = document.getElementById('capture-area');

        if (element) {
            html2canvas(element)
                .then((canvas) => {
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            const imageUrl = URL.createObjectURL(blob);
                            setImage(imageUrl);
                            setIsArOpen(false);
                            toast.dismiss('Physical footprints pushed onchain');
                            // const res = await handleAttestNFT();
                            // if (res) {
                            //     toast.dismiss('');
                            //     toast.success(
                            //         'Physical footprints pushed onchain'
                            //     );
                            // }
                        }
                    });
                })
                .catch((err) =>
                    console.error('Error capturing screenshot:', err)
                );
        }
    };
    const generateImageFromApi = () => {
        const element = document.getElementById('capture-area');

        if (element) {
            html2canvas(element)
                .then((canvas) => {
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            const formData = new FormData();
                            formData.append('image', blob, 'screenshot.png');
                            formData.append(
                                'location_coordinates',
                                JSON.stringify([
                                    location.latitude.toString(),
                                    location.longitude.toString(),
                                ])
                            );
                            if (account.address) {
                                formData.append('recipient', account.address);
                            } else {
                                console.error('Account address is undefined');
                            }
                            try {
                                setIsNftLoading(true);
                                const res = await fetch(
                                    'https://ai-agent-kit-cdp-eas-production.up.railway.app/upload-image',
                                    {
                                        method: 'POST',
                                        body: formData,
                                    }
                                );

                                const data = await res.json();
                                const tuid = await data.attestationUID;
                                console.log(tuid);
                                const val = data.success;
                                if (val) {
                                    setIsNftLoading(false);
                                    setIsNftEnabled(true);
                                }
                            } catch (error) {
                                console.error('Error uploading image:', error);
                            }
                        }
                    }, 'image/png'); // Specify PNG format
                })
                .catch((err) =>
                    console.error('Error capturing screenshot:', err)
                );
        }
    };

    useEffect(() => {
        const timeout = setTimeout(generateImageFromApi, 1000); // Delay to ensure everything is rendered
        return () => clearTimeout(timeout); // Cleanup on component unmount
    }, []);

    return (
        <div
            style={{ height: '60vh', width: '100vw', overflow: 'hidden' }}
            id="capture-area"
        >
            {/* Webcam background */}
            <WebcamBackground />

            {/* 3D Model Canvas */}
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 5, 5]} intensity={1} />
                {isNftEnabled && <NFTModel />}
                <OrbitControls />
            </Canvas>

            {isNftLoading ? (
                <div style={{ position: 'absolute', top: '30%', left: '12%' }}>
                    <WhirlpoolLoader />
                </div>
            ) : (
                <button
                    onClick={captureScreenshot}
                    style={{ position: 'absolute', top: 20, left: 20 }}
                >
                    Capture
                </button>
            )}
        </div>
    );
};

const Ar = ({
    location,
    setIsArOpen,

    setImage,
}: {
    location: any;
    setIsArOpen: React.Dispatch<React.SetStateAction<boolean>>;

    setImage: (image: string | null) => void;
}) => {
    return (
        <div>
            <ArComponent
                location={location}
                setImage={setImage}
                setIsArOpen={setIsArOpen}
            />
        </div>
    );
};

export default Ar;
