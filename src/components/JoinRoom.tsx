import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useLocalVideo, useRoom } from '@huddle01/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
const JoinRoom = ({ teamCode }: { teamCode: string }) => {
    let [isOpen, setIsOpen] = useState(true);
    const { enableVideo, isVideoOn } = useLocalVideo();
    const { joinRoom } = useRoom({
        onJoin: () => {
            console.log('Joined room');
        },
        onLeave: () => {
            console.log('Left the room');
        },
        onPeerJoin: (peerId) => {
            console.log(peerId);
        },
    });
    function close() {
        setIsOpen(false);
    }
    const handleJoinRooom = async () => {
        toast.dismiss();
        toast.loading('Joining room');
        const res = await fetch(
            `https://huddle-01-backend-production.up.railway.app/generate-token?roomId=${'esq-kgil-khh'}`
        );
        const data = await res.json();
        joinRoom({
            roomId: teamCode,
            token: data.token,
        });
        toast.dismiss();
        toast.success('Room joined successfully');
        await enableVideo();
    };
    return (
        <Dialog
            open={isOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={close}
        >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle
                            as="h3"
                            className="text-base/7 font-medium text-white"
                        >
                            Join Room
                        </DialogTitle>
                        {isVideoOn ? (
                            <div className="text-white pt-5">
                                <div className="pb-2">
                                    Anish has joined the room
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm underline">
                                        View Video
                                    </div>
                                    <div className="text-sm underline">
                                        View Audio
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="mt-2 text-sm/6 text-white/50">
                                    Start your journey by sharing your first
                                    memory with your friends.
                                </p>
                                <button
                                    className="bg-black text-white w-full rounded-xl p-2 mt-4"
                                    onClick={handleJoinRooom}
                                >
                                    Join
                                </button>
                            </>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default JoinRoom;
