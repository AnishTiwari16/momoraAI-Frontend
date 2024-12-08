import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { baseSepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { getConfig } from '../config';
import { HuddleClient, HuddleProvider } from '@huddle01/react';
const queryClient = new QueryClient();
const huddleClient = new HuddleClient({
    projectId: 'pi_62JQFNaysQ5Sh3Rc',
    options: {
        // `activeSpeakers` will be most active `n` number of peers, by default it's 8
        activeSpeakers: {
            size: 12,
        },
    },
});

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={getConfig()}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={'yDaZynZGies9vtB5ZQDIVgRkFaM9IwXe'}
                    chain={baseSepolia}
                >
                    <HuddleProvider client={huddleClient}>
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            gutter={8}
                            containerClassName=""
                            containerStyle={{}}
                            toastOptions={{
                                // Define default options
                                className: '',
                                duration: 5000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },

                                // Default options for specific types
                                success: {
                                    duration: 3000,
                                },
                            }}
                        />
                        {children}
                    </HuddleProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Providers;
