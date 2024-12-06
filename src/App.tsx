import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import './App.css';
import Ar from './components/Ar';
import { getUserLocation } from './lib';
export const sdk = createCoinbaseWalletSDK({
    appName: 'My App',
    appLogoUrl: 'https://example.com/logo.png',
    appChainIds: [8453],
    preference: {
        options: 'smartWalletOnly',
        attribution: {
            auto: true,
        },
    },
});
export const provider = sdk.getProvider();
function App() {
    const account = useAccount();

    const handleConnect = async () => {
        await provider.request({ method: 'eth_requestAccounts' });
    };
    const handleDisconnect = async () => {
        await provider.disconnect();
    };
    const handleMakeFriends = async () => {
        const location = await getUserLocation();
        console.log(location);
    };

    return (
        <div>
            <div onClick={() => handleConnect()} className="text-red-200">
                Connect wallet
            </div>
            {account.address}
            <div onClick={() => handleDisconnect()}>Disconnect</div>
            <Ar />
            <div onClick={handleMakeFriends}>Make friends</div>
        </div>
    );
}

export default App;
