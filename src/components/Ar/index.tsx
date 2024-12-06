import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import ss from '../../../public/ss.png';
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
            position={[2, 2, 0]}
        />
    );
};
const ArComponent = ({
    onClose,
    setImage,
}: {
    onClose: () => void;
    setImage: any;
}) => {
    const captureScreenshot = () => {
        const element = document.getElementById('capture-area'); // Capture the container element

        if (element) {
            html2canvas(element)
                .then((canvas) => {
                    // Convert the canvas to a Blob (PNG)
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const imageUrl = URL.createObjectURL(blob); // Create a URL for the image
                            setImage(imageUrl);
                        }
                    });
                    onClose();
                })
                .catch((err) =>
                    console.error('Error capturing screenshot:', err)
                );
        }
    };

    return (
        <div
            style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
            id="capture-area"
        >
            {/* Webcam background */}
            <WebcamBackground />

            {/* 3D Model Canvas */}
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 5, 5]} intensity={1} />
                <NFTModel />
                <OrbitControls />
            </Canvas>

            {/* Button to capture screenshot */}
            <button
                onClick={captureScreenshot}
                style={{ position: 'absolute', top: 20, left: 20 }}
            >
                Capture
            </button>
        </div>
    );
};
const Ar = () => {
    const [showAR, setShowAR] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const handleButtonClick = () => {
        setShowAR(true);
    };

    const handleCloseAR = () => {
        setShowAR(false);
    };
    return (
        <div>
            {/* Button to show AR scene */}
            {!showAR && (
                <button onClick={handleButtonClick}>Capture Memories</button>
            )}

            {/* Render AR scene only if showAR is true */}
            {showAR && (
                <ArComponent onClose={handleCloseAR} setImage={setImage} />
            )}
            {image && (
                <div className="relative">
                    <img src={image} alt="image" />
                    <img
                        src={ss}
                        alt="ss"
                        className="absolute top-0 right-0"
                        height={200}
                        width={200}
                    />
                </div>
            )}
        </div>
    );
};

export default Ar;
