import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import ParticleSwarmLoader from '../ui/Stars';

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
    setImage,
    setIsArOpen,
}: {
    setImage: (image: string | null) => void;
    setIsArOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [isNftEnabled, setIsNftEnabled] = useState(false);
    const [isNftLoading, setIsNftLoading] = useState(false);
    const captureScreenshot = () => {
        const element = document.getElementById('capture-area');

        if (element) {
            html2canvas(element)
                .then((canvas) => {
                    // Convert the canvas to a Blob (PNG)
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const imageUrl = URL.createObjectURL(blob);
                            setImage(imageUrl);
                            setIsArOpen(false);
                        }
                    });
                })
                .catch((err) =>
                    console.error('Error capturing screenshot:', err)
                );
        }
    };
    const captureScreenshot2 = () => {
        const element = document.getElementById('capture-area');

        if (element) {
            html2canvas(element)
                .then((canvas) => {
                    // Convert the canvas to a Blob
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            // Create FormData and append the Blob
                            const formData = new FormData();
                            formData.append('image', blob, 'screenshot.png'); // Append as a PNG file

                            try {
                                // Send FormData to the server
                                setIsNftLoading(true);
                                const res = await fetch(
                                    'https://1650-14-195-142-82.ngrok-free.app/upload-image',
                                    {
                                        method: 'POST',
                                        body: formData,
                                    }
                                );

                                const data = await res.json();
                                const description = data.description;

                                if (description) {
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
        const timeout = setTimeout(captureScreenshot2, 1000); // Delay to ensure everything is rendered
        return () => clearTimeout(timeout); // Cleanup on component unmount
    }, []);

    return (
        <div
            style={{ height: '50vh', width: '100vw', overflow: 'hidden' }}
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
                <div style={{ position: 'absolute', top: 90, left: 72 }}>
                    <ParticleSwarmLoader />
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
    setIsArOpen,

    setImage,
}: {
    setIsArOpen: React.Dispatch<React.SetStateAction<boolean>>;

    setImage: (image: string | null) => void;
}) => {
    return (
        <div>
            <ArComponent setImage={setImage} setIsArOpen={setIsArOpen} />
        </div>
    );
};

export default Ar;
