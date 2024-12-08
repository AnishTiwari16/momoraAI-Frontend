import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import { ShareSocial } from 'react-share-social';
export default function MyModal({ teamCode }: { teamCode: string }) {
    let [isOpen, setIsOpen] = useState(true);

    function close() {
        setIsOpen(false);
    }

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
                            Share with your friends
                        </DialogTitle>
                        <p className="mt-2 text-sm/6 text-white/50">
                            Start your journey by sharing your first memory with
                            your friends.
                        </p>
                        <div className="mt-4">
                            <ShareSocial
                                url={`https://momora-ai-frontend.vercel.app/browse?code=${teamCode}`}
                                socialTypes={[
                                    'whatsapp',
                                    'facebook',
                                    'twitter',
                                    'reddit',
                                    'linkedin',
                                ]}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
