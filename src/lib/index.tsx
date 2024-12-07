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
export const fetchUserBalance = async (address: string) => {
    const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
    // Fetch the balance in wei
    const weiBalance = await provider.getBalance(address);

    // Convert from wei to ether and update the state
    const etherBalance = ethers.formatEther(weiBalance);

    return etherBalance;
};
export function hexToString(hex: any) {
    let result = '';
    for (let i = 0; i < hex.length; i += 2) {
        const hexPair = hex.substr(i, 2);
        result += String.fromCharCode(parseInt(hexPair, 16));
    }
    return result;
}
export const extractCoordinates = (
    decodedData: string
): { latitude: number | null; longitude: number | null } => {
    const latitudeMatch = decodedData.match(/Latitude:\s*(-?\d+\.\d+)/);
    const longitudeMatch = decodedData.match(/Longitude:\s*(-?\d+\.\d+)/);

    return {
        latitude: latitudeMatch ? parseFloat(latitudeMatch[1]) : null,
        longitude: longitudeMatch ? parseFloat(longitudeMatch[1]) : null,
    };
};
export const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371000; // Earth radius in meters
    const φ1 = lat1 * (Math.PI / 180); // Convert degrees to radians
    const φ2 = lat2 * (Math.PI / 180); // Convert degrees to radians
    const Δφ = (lat2 - lat1) * (Math.PI / 180); // Difference in latitude
    const Δλ = (lon2 - lon1) * (Math.PI / 180); // Difference in longitude

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};
