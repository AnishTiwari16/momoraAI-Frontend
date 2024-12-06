import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export function getConfig() {
    return createConfig({
        chains: [baseSepolia],
        connectors: [
            injected(),
            coinbaseWallet({
                appName: 'Create Wagmi',
                preference: 'smartWalletOnly',
            }),
        ],
        storage: createStorage({
            storage: cookieStorage,
        }),
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
