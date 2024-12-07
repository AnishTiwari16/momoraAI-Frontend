import { Button, Dialog, DialogPanel } from '@headlessui/react'
import { useEffect, useState } from 'react'
import findFriendsGif from "../../assets/worldwide.gif"
import { GradualSpacing } from './GradualSpacing'

export default function FindFriendsModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isGifOpen, setIsGifOpen] = useState(true)

    useEffect(() => {
        setIsGifOpen(true)
    }, [isOpen])

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    return (
        <>
            <Button
                onClick={open}
                className=" bg-white text-black px-4 py-2 rounded-lg text-sm font-medium focus:outline-none data-[hover]:bg-white/30 data-[focus]:outline-1 data-[focus]:outline-white"
            >
                Find Friends
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-[250px] rounded-xl bg-white/25 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            {isGifOpen ? (
                                <div className="text-left">
                                    <GradualSpacing
                                        duration={0.5}
                                        delayMultiple={0.08}
                                        className="font-display text-left text-xs    font-bold -tracking-widest text-black dark:text-white  md:leading-[3rem]"
                                        text="Finding Friends Nearby ....."
                                    />
                                    <img
                                        onClick={() => setIsGifOpen(false)}
                                        src={findFriendsGif}
                                        alt="loading....."
                                        className="rounded-full p-5 m-2"
                                    />
                                </div>
                            ) : (
                                <span>gif is hidden</span>
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
