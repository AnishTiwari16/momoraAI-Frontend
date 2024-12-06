import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { baseSepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { getConfig } from '../config';

const queryClient = new QueryClient();
const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={getConfig()}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={'yDaZynZGies9vtB5ZQDIVgRkFaM9IwXe'}
                    chain={baseSepolia}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Providers;
