import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export function getConfig() {
    return createConfig({
        chains: [baseSepolia],
        connectors: [
            coinbaseWallet({
                appName: 'onchainkit',
            }),
        ],
        ssr: true,
        transports: {
            [baseSepolia.id]: http(),
        },
    });
}

declare module 'wagmi' {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}
