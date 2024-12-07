// import { Address, Name } from '@coinbase/onchainkit/identity';
// import { color } from '@coinbase/onchainkit/theme';
// import { WalletDefault } from '@coinbase/onchainkit/wallet';
// import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
// import { useLocalVideo, useRoom } from '@huddle01/react';
// import { useEffect, useRef, useState } from 'react';
// import { baseSepolia } from 'viem/chains';
// import { useAccount } from 'wagmi';
// import '../App.css';
// import Ar from '../components/Ar';
// import { getUserLocation, sendFunds } from '../lib';
// import { useEthersProvider } from '../wagmi/useEthersProvider';
// import { useEthersSigner } from '../wagmi/useEthersSigner';
// const easContractAddress = '0x4200000000000000000000000000000000000021';
// const schemaUID =
//     '0x0d24b34bf33676733015b66b9cdc5a0b6a3f636e61e217de3b249249c66d45b1';
// const Browse = () => {
//     const account = useAccount();
//     const [huddle, setHuddle] = useState({
//         roomId: '',
//         token: '',
//     });

//     const signer = useEthersSigner();
//     const pro = useEthersProvider();
//     const { joinRoom, leaveRoom } = useRoom({
//         onJoin: () => {
//             console.log('Joined room');
//         },
//         onLeave: () => {
//             console.log('Left the room');
//         },
//         onPeerJoin: (peerId) => {
//             console.log(peerId);
//         },
//     });
//     const { isVideoOn, enableVideo, disableVideo, stream } = useLocalVideo();

//     const handleAttest = async () => {
//         console.log('calling function');
//         const location = await getUserLocation();
//         const eas: any = new EAS(easContractAddress);
//         eas.connect(signer);
//         const schemaEncoder = new SchemaEncoder(
//             'address smart_wallet,string user_email,string[] location_coordinates'
//         );
//         const encodedData = schemaEncoder.encodeData([
//             {
//                 name: 'smart_wallet',
//                 value: account.address || '',
//                 type: 'address',
//             },
//             { name: 'user_email', value: 'anishtiw', type: 'string' },
//             {
//                 name: 'location_coordinates',
//                 value: [
//                     `Latitude: ${location.latitude}`,
//                     `Longitude: ${location.longitude}`,
//                 ],
//                 type: 'string[]',
//             },
//         ]);
//         const transaction = await eas.attest({
//             schema: schemaUID,
//             data: {
//                 recipient: account.address,
//                 expirationTime: 0,
//                 revocable: true,
//                 data: encodedData,
//             },
//         });
//         const newAttestationUID = await transaction.wait();
//         console.log('New attestation UID:', newAttestationUID);
//     };

//     const handleMakeFriends = async () => {
//         await handleAttest();
//     };
//     // const handleJoinRoom = async () => {
//     //     joinRoom({
//     //         roomId: 'YOUR_ROOM_ID',
//     //         token: 'YOUR_TOKEN',
//     //     });
//     // };
//     const Huddle01 = async () => {
//         const res = await fetch(
//             'https://huddle-01-backend-production.up.railway.app/create-room',
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     title: 'test',
//                 }),
//             }
//         );
//         const data = await res.json();
//         const roomId = data.data.roomId;

//         setHuddle((prev) => ({ ...prev, roomId }));
//         if (roomId) {
//             const res = await fetch(
//                 `https://huddle-01-backend-production.up.railway.app/generate-token?roomId=${roomId}`
//             );
//             const data = await res.json();

//             setHuddle((prev) => ({ ...prev, token: data.token }));
//         }
//     };
//     const handleJoinRooom = async () => {
//         const res = await fetch(
//             `https://huddle-01-backend-production.up.railway.app/generate-token?roomId=${'esq-kgil-khh'}`
//         );
//         const data = await res.json();
//         joinRoom({
//             roomId: 'esq-kgil-khh',
//             token: data.token,
//         });
//     };
//     // const { peerIds } = usePeerIds({
//     //     roles: [],
//     //     labels: [],
//     //     onPeerRoleUpdate(data) {},
//     // });

//     const videoRef = useRef<HTMLVideoElement>(null);
//     // const { stream } = useRemoteVideo({
//     //     peerId: 'peerId-F0cZHFlGL-YewwM1kAXk8',
//     // });

//     useEffect(() => {
//         if (videoRef.current && stream) {
//             videoRef.current.srcObject = stream;
//         }
//     }, [stream]);
//     const handleOnClick = async () => {
//         if (account.address) {
//             await sendFunds(account.address, pro);
//         }
//     };
//     console.log(huddle);
//     return (
//         <div>
//             <WalletDefault />

//             <Name address={account.address} chain={baseSepolia} />
//             <Address className={color.foregroundMuted} />
//             <Ar />
//             <div onClick={handleMakeFriends}>Make friends</div>
//             <div onClick={Huddle01}>Create room</div>
//             <div onClick={handleJoinRooom}>Join Room</div>
//             <div onClick={leaveRoom}>Leave Room</div>
//             <div
//                 onClick={() => {
//                     isVideoOn ? disableVideo() : enableVideo();
//                 }}
//             >
//                 Fetch and Produce Video Stream
//             </div>
//             {/* peerId-gKF4abf5N_3zwtvfp9Wp2 */}
//             <video ref={videoRef} autoPlay muted />
//             <div onClick={handleOnClick}>Get tokens</div>
//         </div>
//     );
// };

// export default Browse;
