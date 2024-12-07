import { ethers } from 'ethers';
interface UserLocation {
    latitude: number;
    longitude: number;
}

export const getUserLocation = () => {
    return new Promise<UserLocation>((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    reject(error);
                }
            );
        } else {
            const error = new Error(
                'Geolocation is not supported by this browser.'
            );
            console.error(error.message);
            reject(error);
        }
    });
};
export const sendFunds = async (address: string, pro: any) => {
    try {
        const wallet = new ethers.Wallet(
            'e1d4b11589a54870b3df94b0c20bb6dd8b3e1611123b1223f7901041e126b612',
            pro
        );
        const value = ethers.parseUnits('0.001', 'ether');
        // Create and send the transaction
        const tx = await wallet.sendTransaction({
            to: address,
            value: value,
        });

        // Wait for transaction confirmation
        await tx.wait();
        console.log('Transaction complete');
    } catch (err) {
        console.error(err);
    }
};
