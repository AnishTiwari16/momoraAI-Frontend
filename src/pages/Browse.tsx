import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { useAccount } from 'wagmi';
import { useEthersSigner } from '../wagmi/useEthersSigner';
import { getUserLocation } from '../lib';
import Ar from '../components/Ar';
import '../App.css';
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

const easContractAddress = '0x4200000000000000000000000000000000000021';
const schemaUID =
    '0x0d24b34bf33676733015b66b9cdc5a0b6a3f636e61e217de3b249249c66d45b1';
const Browse = () => {
    const account = useAccount();
    const signer = useEthersSigner();
    const handleConnect = async () => {
        await provider.request({ method: 'eth_requestAccounts' });
    };
    const handleDisconnect = async () => {
        await provider.disconnect();
    };
    const handleAttest = async () => {
        const location = await getUserLocation();
        const eas: any = new EAS(easContractAddress);
        eas.connect(signer);
        const schemaEncoder = new SchemaEncoder(
            'address smart_wallet,string user_email,string[] location_coordinates'
        );
        const encodedData = schemaEncoder.encodeData([
            {
                name: 'smart_wallet',
                value: account.address || '',
                type: 'address',
            },
            { name: 'user_email', value: 'anishtiw', type: 'string' },
            {
                name: 'location_coordinates',
                value: [
                    `Latitude: ${location.latitude}`,
                    `Longitude: ${location.longitude}`,
                ],
                type: 'string[]',
            },
        ]);
        const transaction = await eas.attest({
            schema: schemaUID,
            data: {
                recipient: account.address,
                expirationTime: 0,
                revocable: true,
                data: encodedData,
            },
        });
        const newAttestationUID = await transaction.wait();
        console.log('New attestation UID:', newAttestationUID);
    };
    const handleMakeFriends = async () => {
        await handleAttest();
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
};

export default Browse;
